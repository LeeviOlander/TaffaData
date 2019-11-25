Math.divideByKey = function(numerator, denominator)
{
	var result = [];
	var c = numerator.length;

	for (var key in numerator)
	{
		result[key] = numerator[key] / denominator[key];
	}

	return result;
}
