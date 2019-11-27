Math.divideByKey = function (numerator, denominator)
{
	var result = {};
	var c = numerator.length;

	for (var key in numerator)
	{
		result[key] = numerator[key] / denominator[key];
	}

	return result;
};

Math.sumByKey = function (associativeArrays)
{
	var allKeysSet = new Set();

	var aac = associativeArrays.length;
	for (var i = 0; i < aac; i++)
	{
		var assocArray = associativeArrays[i];

		for (var key in assocArray)
		{
			allKeysSet.add(key);
		}
	}

	var allKeys = Array.from(allKeysSet);

	allKeys.sort();

	var result = {};

	var c = allKeys.length;
	for (var i = 0; i < c; i++)
	{
		var key = allKeys[i];

		result[key] = 0;

		for (var k = 0; k < aac; k++)
		{
			var assocArray = associativeArrays[k];

			if (key in assocArray)
			{
				result[key] += assocArray[key];
			}
		}
	}

	return result;

};

Math.cumSum = function(array)
{
	var cumSum = [];
	array.reduce(function (a, b, i) { return cumSum[i] = a + b; }, 0);

	return cumSum;
}

Math.trimStart = function (associativeArray, valueToTrim = 0)
{
	var result = {};
	var nonZeroFound = false;
	for (var key in associativeArray)
	{
		var val = associativeArray[key];

		if (nonZeroFound || val != valueToTrim)
		{
			result[key] = val;
		}
	}

	return result;
}