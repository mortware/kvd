# @mortware/kvd

## Configuration

This package is configured through a JSON configuration file. The configuration is set at startup and remains constant throughout the application's lifecycle.

### Using a configuration file

Create a file named `kvd-config.json` in the root of your project with the following structure:

```json
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

The configuration object has the following structure:

- `azure`: Contains Azure-specific configurations
  - `blob`: Azure Blob Storage settings
    - `url`: URL for Azure Blob Storage
    - `container`: Name of the container in Azure Blob Storage
  - `queue`: Azure Queue Storage settings
    - `url`: URL for Azure Queue Storage
    - `import`: (Optional) Name of the import queue in Azure Queue Storage
    - `catalog`: (Optional) Name of the catalog queue in Azure Queue Storage
  - `sql`: Azure SQL Database settings
    - `server`: Azure SQL Server address
    - `database`: Name of the database in Azure SQL
- `processDelay`: (Optional) Delay in milliseconds to slow down the automation process

### Accessing the configuration

The configuration is exported as a read-only object and can be accessed in your code as follows:

```typescript
import { config } from '@mortware/kvd';
console.log(config.azure.blob.url);
```