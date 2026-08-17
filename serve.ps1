param(
    [int]$Port = 8080
)

$root = (Resolve-Path (Split-Path -Parent $PSCommandPath)).Path
$listener = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Loopback,
    $Port
)
$listener.Start()

Write-Host "Portfolio preview: http://localhost:$Port/"
Write-Host 'Press Ctrl+C to stop the server.'

$contentTypes = @{
    '.css' = 'text/css; charset=utf-8'
    '.html' = 'text/html; charset=utf-8'
    '.js' = 'text/javascript; charset=utf-8'
    '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png' = 'image/png'
    '.svg' = 'image/svg+xml'
    '.webp' = 'image/webp'
}

function Send-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$ContentType,
        [byte[]]$Body
    )

    $statusText = if ($StatusCode -eq 200) { 'OK' } else { 'Not Found' }
    $header = @(
        "HTTP/1.1 $StatusCode $statusText",
        "Content-Type: $ContentType",
        "Content-Length: $($Body.Length)",
        'Connection: close',
        '',
        ''
    ) -join "`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)

    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    $Stream.Write($Body, 0, $Body.Length)
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()

        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new(
                $stream,
                [System.Text.Encoding]::ASCII,
                $false,
                1024,
                $true
            )
            $requestLine = $reader.ReadLine()

            while ($reader.ReadLine()) {
                # Read request headers before responding.
            }

            $requestTarget = $requestLine.Split(' ')[1].Split('?')[0]
            $relativePath = [Uri]::UnescapeDataString($requestTarget).TrimStart('/')

            if ([string]::IsNullOrWhiteSpace($relativePath)) {
                $relativePath = 'index.html'
            }

            $candidate = Join-Path $root ($relativePath -replace '/', '\\')
            $filePath = $null

            try {
                $filePath = (Resolve-Path -LiteralPath $candidate -ErrorAction Stop).Path
            }
            catch {
                $filePath = $null
            }

            $isInsideRoot = $filePath -and $filePath.StartsWith(
                $root,
                [System.StringComparison]::OrdinalIgnoreCase
            )

            if (-not $isInsideRoot -or -not (Test-Path $filePath -PathType Leaf)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
                Send-Response $stream 404 'text/plain; charset=utf-8' $body
                continue
            }

            $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = $contentTypes[$extension]

            if (-not $contentType) {
                $contentType = 'application/octet-stream'
            }

            $body = [System.IO.File]::ReadAllBytes($filePath)
            Send-Response $stream 200 $contentType $body
        }
        finally {
            $client.Close()
        }
    }
}
finally {
    $listener.Stop()
}
