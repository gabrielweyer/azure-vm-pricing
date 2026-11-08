using System;
using System.Linq;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.ReportGenerator;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

namespace Gabo;

[ShutdownDotNetAfterServerBuild]
sealed class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode

    public static int Main() => Execute<Build>(x => x.GenerateCoverage);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

    [Solution] readonly Solution Solution;

    static AbsolutePath SourceDirectory => RootDirectory / "src";
    static AbsolutePath TestsDirectory => RootDirectory / "tests";
    static AbsolutePath ArtifactsDirectory => RootDirectory / "artifacts";
    static AbsolutePath TestResultsDirectory => ArtifactsDirectory / "test-results";
    static AbsolutePath CodeCoverageDirectory => ArtifactsDirectory / "coverage-report";

#pragma warning disable CA1822 // Can't make this static as it breaks NUKE
    Target Clean => _ => _
#pragma warning restore CA1822
        .Executes(() =>
        {
            SourceDirectory.GlobDirectories("**/bin", "**/obj").ForEach(s => s.DeleteDirectory());
            TestsDirectory.GlobDirectories("**/bin", "**/obj").ForEach(t => t.DeleteDirectory());
            ArtifactsDirectory.CreateOrCleanDirectory();
        });

    Target Restore => _ => _
        .DependsOn(Clean)
        .Executes(() =>
        {
            DotNetRestore(s => s
                .SetProjectFile(Solution));
        });

    Target Compile => _ => _
        .DependsOn(Restore)
        .Executes(() =>
        {
            DotNetBuild(s => s
                .SetProjectFile(Solution)
                .SetConfiguration(Configuration)
                .EnableNoRestore());
        });

    Target VerifyFormat => _ => _
        .DependsOn(Compile)
        .Executes(() =>
        {
            DotNet($"format --verify-no-changes");
        });

    Target Test => _ => _
        .DependsOn(VerifyFormat)
        .Executes(() =>
        {
            // The test projects have a single target framework. Not evaluating them with MSBuild avoids depending on the
            // NuGet assemblies shipped with NUKE matching the ones of the installed .NET SDK.
            var testProjects = Solution.AllProjects
                .Where(p => p.Name.EndsWith("Tests", StringComparison.Ordinal));

            DotNetTest(s => s
                .SetConfiguration(Configuration)
                .SetDataCollector("XPlat Code Coverage")
                .EnableNoBuild()
                .CombineWith(testProjects, (ss, testProject) =>
                {
                    var testResultsName = testProject.Path.NameWithoutExtension;
                    var testResultsDirectory = TestResultsDirectory / testResultsName;

                    return ss
                        .SetProjectFile(testProject)
                        .SetResultsDirectory(testResultsDirectory)
                        .SetLoggers($"html;LogFileName={testResultsName}.html");
                }), completeOnFailure: true);
        });

    Target GenerateCoverage => _ => _
        .DependsOn(Test)
        .Executes(() =>
        {
            ReportGeneratorTasks.ReportGenerator(s => s
                .SetFramework("net10.0")
                .SetReports($"{TestResultsDirectory}/**/coverage.cobertura.xml")
                .SetTargetDirectory(CodeCoverageDirectory)
                .SetReportTypes(ReportTypes.Html));
        });
}
