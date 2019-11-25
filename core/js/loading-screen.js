class LoadingScreen
{
	constructor(loadingElement, loadingProgressBarProgressElement, loadingOutputElement)
	{
		this.loadingElement = loadingElement;
		this.loadingProgressBarProgressElement = loadingProgressBarProgressElement;
		this.loadingOutputElement = loadingOutputElement;
	}

	hideLoadingScreen()
	{
		this.loadingElement.classList.add(Css.loadingScreenHideClassName);
	}

	showLoadingScreen()
	{

		if (this.loadingElement.classList.contains(Css.loadingScreenHideClassName))
		{
			this.loadingOutputElement.innerHTML = "";
			this.loadingElement.classList.remove(Css.loadingScreenHideClassName);
			this.setLoadingScreenProgressBarProgress(0);
		}
		
	}

	loadingCompleted()
	{
		this.setLoadingScreenProgressBarProgress(100);
		this.hideLoadingScreen();
	}

	reportProgress(progress, output)
	{
		this.setLoadingScreenProgressBarProgress(progress);
		this.writeLoadingScreenOutput(progress, output);
	}

	setLoadingScreenProgressBarProgress(progress)
	{
		this.loadingProgressBarProgressElement.style.width = progress + '%';
	}

	writeLoadingScreenOutput(progress, output)
	{
		var isScrolledToBottom = this.loadingOutputElement.scrollTop >= (this.loadingOutputElement.scrollHeight - this.loadingOutputElement.offsetHeight);

		var item = document.createElement('li');
		item.classList.add(Css.loadingOutputItemClassName);

		var progressElement = document.createElement('p');
		progressElement.innerHTML = progress + '%';

		var outputElement = document.createElement('p');
		outputElement.innerHTML = output;

		item.appendChild(progressElement);
		item.appendChild(outputElement);

		this.loadingOutputElement.appendChild(item);

		if (isScrolledToBottom)
		{
			this.loadingOutputElement.scrollTop = this.loadingOutputElement.scrollHeight;
		}
	}

}