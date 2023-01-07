using System.ComponentModel;
using Nuke.Common.Tooling;

namespace Gabo;

[TypeConverter(typeof(TypeConverter<Configuration>))]
sealed class Configuration : Enumeration
{
    public static Configuration Debug = new() { Value = nameof(Debug) };
    public static Configuration Release = new() { Value = nameof(Release) };

    public static implicit operator string(Configuration configuration)
    {
        return configuration.Value;
    }
}
