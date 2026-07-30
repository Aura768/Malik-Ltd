$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cmd = Join-Path $root 'scripts\opencode.cmd'

if (-not (Test-Path $cmd)) {
  throw "opencode.cmd not found at: $cmd"
}

# Forward all args to the cmd wrapper
$arguments = @($args) -join ' '
& cmd /c "`"$cmd`" $arguments"
exit $LASTEXITCODE
