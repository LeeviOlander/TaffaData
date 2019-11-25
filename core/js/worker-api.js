class WorkerApi
{
	static startWorker(workerOnInput, workerOnOutput)
	{
		// Launch and return a Web Worker that WORKS ON LOCAL FILES!

		var workerJs = "self.onmessage = " + workerOnInput.toString();

		var blob = new Blob([workerJs], { type: 'application/javascript' });

		var worker = new Worker(URL.createObjectURL(blob));

		worker.onmessage = workerOnOutput;

		return worker;
	}
}