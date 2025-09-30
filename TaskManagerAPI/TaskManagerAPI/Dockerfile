# Build stage
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

# Copy project file
COPY ["TaskManagerAPI.csproj", "."]
RUN dotnet restore "TaskManagerAPI.csproj"

# Copy everything else
COPY . .
WORKDIR "/src"
RUN dotnet build "TaskManagerAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "TaskManagerAPI.csproj" -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS final
WORKDIR /app

# Create non-root user for security
RUN adduser -u 1000 --disabled-password --gecos "" appuser && \
    mkdir -p /app/Data && \
    chown -R appuser:appuser /app

# Copy published application
COPY --from=publish /app/publish .
USER appuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Entry point
ENTRYPOINT ["dotnet", "TaskManagerAPI.dll"]