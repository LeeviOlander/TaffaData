class Statistics
{
	static movingAverage(data, span)
	{
		var c = data.length;
		var maData = [];

		var maValue = 0;

		for (var i = 0; i < span; i++)
		{
			var count = 0;
			maValue = 0.0;

			for (var j = 0; j < span; j++)
			{
				if (i - j >= 0)
				{
					maValue += data[i - j];
				}
				else
				{
					maValue += 0;
				}
			}

			maValue /= span;

			maData.push(maValue);
		}

		for (var i = span; i < c; i++)
		{
			maValue = -data[i - span] / span + maValue + data[i] / span;
			maData.push(maValue);
		}

		return maData;
	}

	static linearRegression(y, x = null)
	{
		var n = y.length;

		if (x == null)
		{
			x = Array.from(Array(n).keys());
		}

		var sumX = 0;
		var sumY = 0;
		var sumXY = 0;
		var sumXX = 0;
		var sumYY = 0;

		for (var i = 0; i < n; i++)
		{
			sumX += x[i];
			sumY += y[i];
			sumXY += x[i] * y[i];
			sumXX += x[i] * x[i];
			sumYY += y[i] * y[i];
		}

		var lr = {};

		lr.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
		lr.intercept = (sumY - lr.slope * sumX) / n;
		lr.r2 = Math.pow((n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)), 2);

		return lr;
	}

}

