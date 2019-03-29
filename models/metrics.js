
module.exports.thermalStatus = {
		"measurement": "ThermalStatus",
		"resource": "Chassis/System.Embedded.1/Thermal",
		"metric": "Metric",
		"collection": [{
			"key": "Temperatures",
			"tags": [{
				"name": "SensorName",
				"key": "Name",
				"default": ""
			},{
				"name": "Health",
				"key": "Status.Health",
				"default": ""
			},{
				"name": "UpperCriticalThreshold",
				"key": "UpperThresholdCritical",
				"default": ""
			},{
				"name": "UpperNonCriticalThreshold",
				"key": "UpperThresholdNonCritical",
				"default": ""
			},{
				"name": "LowerCriticalThreshold",
				"key": "LowerThresholdCritical",
				"default": ""
			},{
				"name": "LowerNonCriticalThreshold",
				"key": "LowerThresholdNonCritical",
				"default": ""
			}],
			"fields": [{
				"name": "Reading",
				"key": "ReadingCelsius",
				"default": ""
			}]
		}]
	}

module.exports.sensorInfo = {
		"measurement": "SensorInfo",
		"resource": "Chassis/System.Embedded.1/Power",
		"metric": "Metric",
		"collection": [{
			"key": "Voltages",
			"tags": [{
				"name": "DeviceID",
				"key": "MemberID",
				"default": ""
			},{
				"name": "SensorName",
				"key": "Name",
				"default": ""
			},{
				"name": "SensorType",
				"default": "Voltage"
			},{
				"name": "PrimaryStatus",
				"default": ""
			},{
				"name": "OperationalStatus",
				"default": ""
			},{
				"name": "HealthState",
				"key": "Status.Health",
				"default": ""
			},{
				"name": "CurrentState",
				"default": ""
			},{
				"name": "LowerCriticalThreshold",
				"key": "LowerThresholdCritical",
				"default": ""
			},{
				"name": "UpperCriticalThreshold",
				"key": "UpperThresholdCritical",
				"default": ""
			},{
				"name": "LowerNonCriticalThreshold",
				"key": "LowerThresholdNonCritical",
				"default": ""
			},{
				"name": "UpperNonCriticalThreshold",
				"key": "UpperThresholdNonCritical",
				"default": ""
			}],
			"fields": [{
				"name": "CurrentReading",
				"key": "ReadingVolts",
				"default": ""
			}]
		}]
}