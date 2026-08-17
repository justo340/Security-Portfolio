$partialNames = @(
    'header',
    'hero',
    'work',
    'skills',
    'certifications',
    'profile',
    'about',
    'footer'
)
$partials = [ordered]@{}

foreach ($name in $partialNames) {
    $path = Join-Path $PSScriptRoot "partials/$name.html"
    $partials[$name] = [System.IO.File]::ReadAllText($path)
}

$output = @('window.sitePartials = {')

foreach ($name in $partialNames) {
    $output += "  $name`: ["
    $lines = $partials[$name] -split "`r?`n"

    foreach ($line in $lines) {
        $escapedLine = $line.Replace('\', '\\').Replace('"', '\"')
        $escapedLine = $escapedLine.Replace("`t", '\t')
        $output += "    `"$escapedLine`","
    }

    $output += '  ].join("\n"),'
}

$output += '};'
[System.IO.File]::WriteAllLines(
    "$PSScriptRoot/components.js",
    $output,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Host 'Created components.js from the files in partials/.'
