class DataHandler
{
	static getSumByDateGroupedByCategory(data, expectedCategories, summableProperty, categoryProperty, startDate = new Date(2000, 1, 1), endDate = new Date(), dateProperty = 'date', totalCategory = 'Total', itemCountByDateKey = 'itemCountByDate')
	{
		if (typeof startDate == 'string')
		{
			startDate = new Date(startDate);
		}

		if (typeof endDate == 'string')
		{
			endDate = new Date(endDate);
		}

		var sumByDateGroupedByCategory = {};

		sumByDateGroupedByCategory[totalCategory] = {};
		sumByDateGroupedByCategory[itemCountByDateKey] = {};
		var c = data.length; 

		for (var i = 0; i < c; i++)
		{
			var dataItem = data[i];
			var dateKey = dataItem[dateProperty];
			var date = new Date(dateKey);
			var category = dataItem[categoryProperty];
			var summable = dataItem[summableProperty];

			if (startDate <= date && date <= endDate)
			{
			    if (!(category in sumByDateGroupedByCategory))
			    {
				    sumByDateGroupedByCategory[category] = {};
			    }

				if (!(dateKey in sumByDateGroupedByCategory[totalCategory]))
			    {
					sumByDateGroupedByCategory[totalCategory][dateKey] = 0;
			    }

				if (!(dateKey in sumByDateGroupedByCategory[category]))
				{
					sumByDateGroupedByCategory[category][dateKey] = 0;
				}

				if (!(dateKey in sumByDateGroupedByCategory[itemCountByDateKey]))
				{
					sumByDateGroupedByCategory[itemCountByDateKey][dateKey] = 0;
				}

				sumByDateGroupedByCategory[itemCountByDateKey][dateKey] += 1;
                

				sumByDateGroupedByCategory[category][dateKey] += summable;
				sumByDateGroupedByCategory[totalCategory][dateKey] += summable;
			}

		}

        // Add one zero to the expected categories if they are otherwise empty.
        // This fixes the annoying problem of having zero entries in the result.
		for (var i = 0; i < expectedCategories.length; i++)
		{
			var category = expectedCategories[i];

			if (!(category in sumByDateGroupedByCategory))
			{
				sumByDateGroupedByCategory[category] = {};
				sumByDateGroupedByCategory[category][DataHandler.zeroFixKey] = 0;
			}
		}

		return sumByDateGroupedByCategory;
	}
}

DataHandler.zeroFixKey = 'fix';