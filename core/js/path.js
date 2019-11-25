class Path
{
	static basename(filePath)
	{
		return filePath.split('/').pop();
	}

	static basenameWithoutFileExtension(filePath)
	{
		var basename = Path.basename(filePath);
		var split = basename.split('.');
		return basename.replace('.' + split[split.length - 1], '');
	}
}