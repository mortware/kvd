# @mortware/kvd

## Configuration

This package can be configured through a JSON configuration file or environment variables. The configuration is set at startup and remains constant throughout the application's lifecycle.

### Using a configuration file

Create a file named `kvd-config.json` in the root of your project with the following structure:

```
json
{
  "azure": {
    "blob": {
      "storageUrl": "your-blob-storage-url",
      "containerName": "your-container-name",
    },
    "queue": {
      "storageUrl": "your-queue-storage-url",
      "importName": "your-queue-name",
    },
    "sql": {
      "server": "your-azure-sql-server",
      "database": "your-azure-sql-database"
    }
  },
  "processDelay": "delay-in-ms"
}
```

### Using environment variables

Set the following environment variables:

- `AZURE_BLOB_STORAGE_URL`
- `AZURE_BLOB_STORAGE_CONTAINER`
- `AZURE_QUEUE_STORAGE_URL`
- `AZURE_QUEUE_IMPORT_NAME`
- `AZURE_SQL_SERVER`
- `AZURE_SQL_DATABASE`
- `PROCESS_DELAY`

Environment variables take precedence over the configuration file.