var content =
`
	<p><strong><em>ABOUT JS</em></strong></p>
`;

function workerOnInput(e)
{
	var sum = 0;
	for (var i = 0; i < 100000000; i++)
	{
		sum += Math.random();
	}

	postMessage(e.data + sum);
}
function workerOnOutput(e)
{
	console.log(e.data);
}

var w = WorkerApi.startWorker(workerOnInput, workerOnOutput);

w.postMessage("Hellow  ");
