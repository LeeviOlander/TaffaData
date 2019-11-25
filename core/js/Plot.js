class Plot
{
	static plot(elementId, data = [], layout = {}, config = {})
	{
		layout.paper_bgcolor = 'rgba(0,0,0,0)';
		layout.plot_bgcolor = 'rgba(0,0,0,0)';
		layout.margin = { t: 60, r: 40, b: 40, l: 60};
		layout.legend = { orientation: 'h' };

		config.displayModeBar = true;
		config.displaylogo = false;
		config.responsive = true;

		Plotly.newPlot(elementId, data, layout, config);
	}

	static plotCard(containerElementId, title, generateDataCallback, layout = {}, config = {})
	{
		var onCompleteCallback = function (elementId)
		{
			Plot.plot(elementId, generateDataCallback, layout, config);
		}

		Card.generateCard(containerElementId, title, parameterInputs, onCompleteCallback);
	}

	static plotCardWithParameters(containerElementId, title, generateDataCallback, layout = {}, config = {}, parameterInputs = [], parameterValues = {})
	{
		var setContentCallback = function (elementId, newParameterValues)
		{
			Plot.plot(elementId, generateDataCallback(newParameterValues), layout, config);
		}

		Card.generateCardWithParameters(containerElementId, title, parameterInputs, setContentCallback, parameterValues);
	}
}