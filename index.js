
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
		this.metrics = config.redfish.metrics;
	}

	get fileValues() {
		console.log(this.metrics);
	}



	exportInfluxDatabase(database, output) {
		var databaseSchema = database.options.schema;
		var epoch = config.epoch;
		var finalRow = [];

		function createOutputFile(fileName, serverID, report, dataset) {
			var result = dataset;
			var name = path.parse(fileName).name;
			var resultsDir = `${path.parse(fileName).dir}${path.sep}`;
			var resultFileName = `${name}_${serverID}_${report}${path.parse(fileName).ext}`;

			fs.mkdir(resultsDir, {recursive: true}, (err) => {
				if (err) 
					throw err;

				var ws = fs.createWriteStream(`${resultsDir}${resultFileName}`);
				fastcsv.write(result, { headers: false}).pipe(ws);
			});
		}

		function retrieveDatasFromInfluxDB(schemas, measurements) {
			var schema = schemas.pop();

			//console.log(`SCHEMA: ${schema}`);

			if (schema) {

				database.query(`SELECT * FROM ${schema.measurement}`).then(rows => {
					rows.forEach(row => {

						//console.log(reportType);

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
					var rowStruct = require("./config/csvReportStruct").csvReportStruct[`${currentMetric}`];
					var extraInfo = require("./config/csvReportStruct").csvReportStruct.extraInfo;
					var server = "10.26.101.237";
					var copyMeasurements = measurements;
					var interval = config.interval;
					var result = [];

					console.log(rowStruct);
					for (var server in copyMeasurements) {
						var currentInterval = 0;
						//console.log(`==> ${server}`);
						//console.log(measurements[server]);

						for (var timestamp in copyMeasurements[server]) {
							var rowContent = [];
							rowContent.push(currentInterval += interval);
							rowContent.push("Metric");
							rowContent.push(currentMetric);
							//console.log(`|	==> ${timestamp}`);
							//sensorSet.push(sensorInterval);

							for (var index in copyMeasurements[server][timestamp]) {
								//console.log(`|	|	==> ${copyMeasurements[server][timestamp][index]}:`);
								//console.log(copyMeasurements[server][timestamp][index]);

									for (var key in copyMeasurements[server][timestamp][index]) {
										if (rowStruct.hasOwnProperty(key)) {
											//console.log(key);
											rowContent.push(key);
											rowContent.push(copyMeasurements[server][timestamp][index][key]);
											rowContent.push(timestamp);
											for (var extraKey in extraInfo) {
												rowContent.push(copyMeasurements[server][timestamp][index][extraKey]);
											} 
										}
									}
									
								//console.log(`|	|	==> END of ${reportType}:`);
							}
							
							result.push(rowContent);
							rowContent = [];
						}
					}

					result.push(["0.0, END"]);

					createOutputFile(output, server.replace(":", "."), currentMetric, result);

					measurements = [];
					retrieveDatasFromInfluxDB(schemas, measurements);
				});
			} else {
				
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
