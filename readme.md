# @mortware/kvd

## Configuration

This package can be configured either through a JSON configuration file or environment variables.

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

## Usage

### Importing and initializing the package
```typescript 
import { initialize, getConfig } from "@mortware/kvd";      

initialize({      
    azureBlobStorageUrl: "your-blob-storage-url",     
    azureBlobStorageContainer: "your-container-name",     
    azureQueueStorageUrl: "your-queue-storage-url",
    azureQueueImportName: "your-queue-name",
    dbServer: "your-db-server",
    dbName: "your-db-name",
    processDelay: "delay-in-ms"
});
```

### Importing and using the package

```typescript
import { getConfig } from "@mortware/kvd";

const config = getConfig(); 

// Use the config object to access the configured values
console.log(config.azureBlobStorageUrl);
console.log(config.azureBlobStorageContainer);
console.log(config.azureQueueStorageUrl);
console.log(config.azureQueueImportName);
console.log(config.dbServer);
console.log(config.dbName); 
console.log(config.processDelay);
```