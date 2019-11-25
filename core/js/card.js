class Card
{
	static generateCard(containerElementId, title, onCompleteCallback, extraHeaderElements = [])
	{
		var cardId = containerElementId + '-card';
		var contentId = containerElementId + '-content';

		var cardElement = document.createElement('div');
		cardElement.id = cardId;
		cardElement.className = Css.plotContainerClassNames;

		var cardHeaderElement = document.createElement('div');
		cardHeaderElement.className = Css.plotContainerHeaderClassNames;

		var cardHeadingElement = document.createElement('h2');
		cardHeadingElement.className = Css.plotContainerHeaderHeadingClassNames;
		cardHeadingElement.innerHTML = title;

		var cardBodyElement = document.createElement('div');
		cardBodyElement.className = Css.plotContainerBodyClassNames;

		var cardContentElement = document.createElement('div');
		cardContentElement.id = contentId;

		cardHeaderElement.appendChild(cardHeadingElement);

		for (var i = 0; i < extraHeaderElements.length; i++)
		{
			cardHeaderElement.appendChild(extraHeaderElements[i]);
		}

		cardBodyElement.appendChild(cardContentElement);

		cardElement.appendChild(cardHeaderElement);
		cardElement.appendChild(cardBodyElement);

		var containerElement = document.getElementById(containerElementId);
		containerElement.innerHTML = '';
		containerElement.appendChild(cardElement);

		onCompleteCallback(contentId);
	}
	static generateCardWithParameters(containerElementId, title, parameterInputs, setContentCallback, parameterValues = {})
	{
		// Attributes that parametersInputs should have: name, type, data-label

		var headerElements = [];
		var parameterInputElements = [];

		// Convert parameterInputs to elements and append to containerElement
		for (var i = 0; i < parameterInputs.length; i++)
		{
			var input = parameterInputs[i];

			var inputElement = null;

			if (typeof input == 'string')
			{
				var temp = document.createElement('div');

				temp.innerHTML = input;

				inputElement = temp.firstChild;
			}
			else
			{
				inputElement = input;
			}

			var inputLabelElement = document.createElement('label');
			inputLabelElement.className = Css.plotContainerLabelClassNames;
			inputLabelElement.innerHTML = inputElement.dataset.label;

			inputElement.id = containerElementId.replace(' ', '') + '-' + inputElement.name;
			inputElement.className = Css.plotContainerInputClassNames;
			inputElement.onkeyup = function (e)
			{
				if (e.key == "Enter")
				{
					regenerateContentFunction();
				}
			};

			if (!(inputElement.name in parameterValues))
			{
				parameterValues[inputElement.name] = inputElement.value;
			}
			else
			{
				inputElement.value = parameterValues[inputElement.name];
			}

			var inputContainerElement = document.createElement('div');
			inputContainerElement.className = Css.plotContainerInputContainerClassNames;

			inputContainerElement.appendChild(inputLabelElement);
			inputContainerElement.appendChild(inputElement);

			headerElements.push(inputContainerElement);

			parameterInputElements.push(inputElement);
		}

		// Create an OK button that triggers re-render and append to containerElement
		var okButtonElement = document.createElement('button');
		okButtonElement.className = Css.plotContainerButtonClassNames;
		okButtonElement.innerHTML = 'OK';

		headerElements.push(okButtonElement);

		// Create a function that regenerates the data
		var regenerateContentFunction = function ()
		{
			var activeElement = document.activeElement;
			var activeElementId = null;

			if (activeElement != null)
			{
				activeElementId = activeElement.id;
			}

			// Extract new parameter values
			var newParameterValues = {};
			for (var i = 0; i < parameterInputElements.length; i++)
			{
				var inputElement = parameterInputElements[i];

				newParameterValues[inputElement.name] = inputElement.value;
			}

			Card.generateCardWithParameters(containerElementId, title, parameterInputs, setContentCallback, newParameterValues);

			activeElement = document.getElementById(activeElementId);

			if (activeElement != null)
			{
				activeElement.focus();
			}
		};

		okButtonElement.onclick = regenerateContentFunction;

		var onCompleteCallback = function (elementId)
		{
			setContentCallback(elementId, parameterValues);
		};

		Card.generateCard(containerElementId, title, onCompleteCallback, headerElements);
	}
}