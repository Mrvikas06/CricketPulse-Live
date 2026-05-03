param(
    [string]$ServiceName = "x-object-470006-v2",
    [string]$ImageName = "gcr.io/$($env:GCLOUD_PROJECT)/$ServiceName",
    [string]$Region = "us-central1"
)

Write-Output "Deploy script starting for service: $ServiceName"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Error "gcloud CLI not found. Please install and authenticate (https://cloud.google.com/sdk/docs/install)."
    exit 1
}

# Ensure project is set
$proj = $(gcloud config get-value project 2>$null).Trim()
if (-not $proj) {
    Write-Output "No gcloud project set. Please provide project id:"
    $proj = Read-Host "GCP Project ID"
    gcloud config set project $proj
}

Write-Output "Using project: $proj"

if (-not (Test-Path -Path "Dockerfile")) {
    Write-Error "Dockerfile not found in repository root."
    exit 1
}

Write-Output "Building and submitting image: $ImageName"
gcloud builds submit --tag $ImageName .
if ($LASTEXITCODE -ne 0) { Write-Error "Cloud Build failed"; exit 1 }

Write-Output "Deploying to Cloud Run service: $ServiceName"
gcloud run deploy $ServiceName --image $ImageName --region $Region --platform managed --allow-unauthenticated
if ($LASTEXITCODE -ne 0) { Write-Error "Cloud Run deploy failed"; exit 1 }

Write-Output "Deployment complete. Service: $ServiceName"
