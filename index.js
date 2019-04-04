
const os = require("os");
const fs = require("fs");
const influx = require("influx");
const path = require("path");
const fastcsv = require("fast-csv");
const config = require("../rfCollector/config/config");

class CSVGenerator {

	constructor(outputFile) {
		this.projectDir = path.parse(__filename).dir;
		this.rootDir = path.parse(__filename).root;
		this.outputFile = outputFile;
		this.resultFileName;
		this.resultsDir;
		// metric list readed from the Collector config file
		this.metrics = config.redfish.metrics;
	}

	get fileValues() {
		console.log(this.metrics);
	}



	exportInfluxDatabase(database) {
		var databaseSchema = database.options.schema;
		var epoch = config.epoch;
		var finalRow = [];

		function createOutputFile(fileName, serverID, report, dataset) {
			var result = dataset;
			var name = path.parse(fileName).name;
			var resultsDir = `${path.parse(fileName).dir}${path.sep}`;
			var resultFileName = `${name}_${serverID}_${report}${path.parse(fileName).ext}`;
			//console.log(resultsDir);
			//console.log(resultFileName);
			//console.log("=============================");
			//console.log(result);

			fs.mkdir(resultsDir, {recursive: true}, (err) => {
				if (err) 
					throw err;

				var ws = fs.createWriteStream(`${resultsDir}${resultFileName}`);
				fastcsv.write(result, { headers: false}).pipe(ws);
				// TRATAR A AQUI A CRIAÇÃO DOS ARQUIVOS
				//fs.open(`${resultsDir}${resultFileName}`, "a+", (err, file) => {
				//	if (err)
				//		throw err;

					//console.log(`${file}`);
				//	const ws = fs.createWriteStream(`${resultsDir}${resultFileName}`);
				//	fastcsv.write(result, { headers: false, ignoreEmpty: true }).pipe(ws);
				//});
			});
		}

		function retrieveDatasFromInfluxDB(schemas, measurements) {
			var schema = schemas.pop();

			//console.log(`SCHEMA: ${schema}`);

			if (schema) {

				database.query(`SELECT * FROM ${schema.measurement}`).then(rows => {
					rows.forEach(row => {

						//console.log(reportType);
						console.log("OIIIII!!!!!!!!");

						if (measurements[row.Server] == undefined) {
							measurements[row.Server] = [];
						}

						if (measurements[row.Server][row.time.toNanoISOString()] == undefined) {
			            	measurements[row.Server][row.time.toNanoISOString()] = [];
			            }

			            //if (measurements[row.Server][row.time.toNanoISOString()][`${schema.measurement}`] == undefined) {
			            //	measurements[row.Server][row.time.toNanoISOString()][`${schema.measurement}`] = [];
			            //}

			            var measurement = {};
			            for (var i = 0; i < schema.tags.length; i++) {
			            	if (row[schema.tags[i]]) {
			            		measurement[schema.tags[i]] = row[schema.tags[i]];
			            	}
			            }

			            for (var j=0; j<Object.keys(schema.fields).length; j++) {
			            	measurement[Object.keys(schema.fields)[j]] = row[Object.keys(schema.fields)[j]];
			            }

			            measurements[row.Server][row.time.toNanoISOString()].push(measurement);
			            //measurements[row.Server][row.time.toNanoISOString()][`${schema.measurement}`].push(measurement);
						//console.log(measurements);
					});
				}).then(() => {
					var currentMetric = schema.measurement;
					var server = "10.26.101.237";
					var copyMeasurements = measurements;
					var result = [];
					//var interval = config.interval;
					//var sensorInterval = interval;
					//var cont = 0;

					console.log(currentMetric);
					for (var server in copyMeasurements) {
						console.log(`==> ${server}`);
						//console.log(measurements[server]);

						for (var timestamp in copyMeasurements[server]) {
							var rowContent = [];
							console.log(`|	==> ${timestamp}`);
							//sensorSet.push(sensorInterval);

							for (var index in copyMeasurements[server][timestamp]) {
								console.log(`|	|	==> ${copyMeasurements[server][timestamp][index]}:`);
								//console.log(copyMeasurements[server][timestamp][index]);

									for (var key in copyMeasurements[server][timestamp][index]) {
										//console.log(key);
										rowContent.push(key);
										rowContent.push(copyMeasurements[server][timestamp][index][key]);
								//		sensorSet.push(metric);
								//		sensorSet.push(copyMeasurements[server][timestamp][reportType][i][metric]);
										//console.log(measurements[server][timestamp][reportType][i][metric]);
									}
									
								//	console.log(sensorSet);
								//	temp.push(sensorSet);
								//}
								//console.log(temp);
								//createOutputFile("CSVResult\\data.csv", `${server.replace(":". ".")}`, `${reportType}`, temp);
								//console.log(`|	|	==> END of ${reportType}:`);
							}
							
							result.push(rowContent);
							rowContent = [];
							//if (Object.keys(temp).length < epoch){
							//temp.push(sensorSet);
							//	continue;
							//}
							//count = 0;
							//sensorSet = [];
							//console.log(reportType);
							//console.log(temp);
							//createOutputFile("CSVResult\\data.csv", `${server}`, `${metric}`, rowContent);
							//temp = [];
							//resultRow = [];
						}
					}

					console.log(server);
					console.log(currentMetric);
					createOutputFile("CSVResult\\data.csv", server.replace(":", "."), currentMetric, result);


					//console.log(finalRow);

					//createOutputFile("CSVResult\\data.csv", `1454545`, `Thermal`, finalRow);
					//createOutputFile("CSVResult/data.csv", "15425451", "Thermal", finalRow);
					//console.log(finalRow);

					//createOutputFile("10.26.101.237:443", schema.measurement);
					//for (var serverIndex = 0; Object.keys(measurements).length; serverIndex++) {
					//console.log(measurements);
					//}
					measurements = [];
					retrieveDatasFromInfluxDB(schemas, measurements);
				});
			} else {
				//var resultRow = [];
				//var interval = config.interval;
				//var sensorInterval = interval;
				//var cont = 0;

				//for (var server in measurements) {
					//console.log(`==> ${server}`);
					//console.log(measurements[server]);

					//for (var timestamp in measurements[server]) {
						//console.log(`|	==> ${timestamp}`);
						//sensorSet.push(sensorInterval);

						//for (var reportType in measurements[server][timestamp]) {
						//	var temp = [];
							//console.log(`|	|	==> ${reportType}:`);
							//console.log(reportType);

						//	for (var i = 0; i < measurements[server][timestamp][reportType].length; i++) {
						//		var sensorSet = [];
								//console.log(`|	|	|	==> ${measurements[server][timestamp][reportType][i]}`);
						//		for (var metric in measurements[server][timestamp][reportType][i]) {
									//console.log(metric);
						//			sensorSet.push(metric);
						//			sensorSet.push(measurements[server][timestamp][reportType][i][metric]);
									//console.log(measurements[server][timestamp][reportType][i][metric]);
						//		}
								//temp.push(sensorSet);
						//	}
							//console.log(temp);
							//createOutputFile("CSVResult\\data.csv", `${server.replace(":". ".")}`, `${reportType}`, temp);
							//console.log(`|	|	==> END of ${reportType}:`);
						//}
						
						//if (Object.keys(temp).length < epoch){
						//temp.push(sensorSet);
						//	continue;
						//}
						//count = 0;
						//sensorSet = [];
						//console.log(reportType);
						//console.log(temp);
						//createOutputFile("CSVResult\\data.csv", `${server.replace(":", ".")}`, `${currentReport}`, temp);
						//temp = [];
						//resultRow = [];
				//	}
				//}

				//console.log(finalRow);

				//createOutputFile("CSVResult\\data.csv", `1454545`, `Thermal`, finalRow);
				//createOutputFile("CSVResult/data.csv", "15425451", "Thermal", finalRow);
				//console.log(finalRow);

				//createOutputFile("10.26.101.237:443", schema.measurement);
				//for (var serverIndex = 0; Object.keys(measurements).length; serverIndex++) {
				//console.log(measurements);
				//}
			}
		}

		var schemas = [];
		var measurements = [];
		for (var i = 0; i < databaseSchema.length; i++) {
			schemas.push(databaseSchema[i]);
		}

		var result = retrieveDatasFromInfluxDB(schemas, measurements);

	}
}

module.exports = CSVGenerator;
//const csvGen = new CSVGenerator(path.parse("CSVFiles/data.csv"));
//csvGen.createOutputFile();
//csvGen.fileValues;
