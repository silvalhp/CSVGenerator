
const os = require("os");
const fs = require("fs");
const influx = require("influx");
const path = require("path");
const metrics = require("./models/metrics");
const system = require("./config/system");
const database = new influx.InfluxDB({
	host : "tpa-eld7201-dcsim-node01",
	database : "redfish",
	username : "",
	password : "",
	schema: [{
		measurement: "ThermalStatus",
		fields: {
			Reading: 0
		},
		tags: [
		'Server',
		'SensorName',
		'Health',
		'UpperCriticalThreshold',
		'UpperNonCriticalThreshold',
		'LowerCriticalThreshold',
		'LowerNonCriticalThreshold']
	}]
});

function queryMetric() {
	database.query("select * from ThermalStatus").then(rows => {
		console.log(rows);
	}).catch (err => {

	})
}

function mapToTelemetryFormat(schema, measurements) {
	
}

function convertMetricToCSV(metric) {

}

function addMetricsToMetricList(metric) {

}

function createResultsCsvFile(outputPath, separator) {
	// The default path to create the results folder is in the root directory
	var path = "";
	var filePath = "";
	var dirs = outputPath.split(separator);
	var fileName = dirs.pop();

	path = dirs.join(separator);

	console.log(fileName, path);

	fs.mkdir(path, {recursive: true}, (err) => {
		if (err) throw err;
	})

	filePath = `${path}${separator}${fileName}`;

	fs.open(filePath, 'w', (err, file) => {
		if (err) throw err;
	});
}

console.log(system.windows.platform);
const parsedPath = path.parse(__filename);
var workPath;
var folderName = "results";
var fileName = "data.csv";

if (os.platform() == system.windows.platform){
	workPath = `${parsedPath.dir}${system.windows.separator}`;
	createResultsCsvFile("C:\\Users\\dasill\\Projects\\DCSim\\CSVGenerator\\results\\data.csv", system.windows.separator);
	queryMetric();
} else {
	workPath = `${parsedPath.dir}${system.linux.separator}`;
	createResultsCsvFile("/home/dasill/Desktop/data.csv", system.linux.separator);
}

//console.log(workPath);
//mapToTelemetryFormat();
//createResultsCsvFile("C:\\Users\\dasill\\Desktop\\data.csv");
// createResultsCsvFile(work_dir);