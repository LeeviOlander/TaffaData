class Urls
{
	static getParameterString(parameterValueDictionary)
	{
		var str = '?';

		for (var parameter in parameterValueDictionary)
		{
			str += parameter + '=' + parameterValueDictionary[parameter] + '&';
		}

		return str;
	}
}

Urls.dataPackageUrl = 'data/data-package.zip';
Urls.dataStateUrl = 'data/data-state.json';
Urls.developmentPackageUrl = 'dev.zip';

Urls.databaseTableDataViewUrlBase = '/data/database-table-data';

Urls.databaseTableInformationGetUrlBase = 'server/database-tables.php';
Urls.databaseTableDataGetUrlBase = 'server/database-table-data.php';

Urls.tableNameGetParameter = 'table-name';

Urls.updateDataUrl = 'server/update-data.php';
Urls.updateDataIfNeededUrl = 'server/update-data-if-needed.php';

Urls.githubRepoUrl = 'https://github.com/LeeviOlander/TaffaData';