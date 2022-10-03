export default {
	"nodes": [
		{
			"id": "Customer-cluster",
			"nodeType": "srcSink",
			"nodeID": "0",
			"dependencies": [],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "Insights-archive",
			"nodeType": "archive",
			"nodeID": "1",
			"dependencies": [
				0
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "Ingress-service",
			"nodeType": "service",
			"nodeID": "2",
			"dependencies": [
				1
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "Kafka-topic-platform.upload.buckit",
			"nodeType": "kafka",
			"nodeID": "3",
			"dependencies": [
				2
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "SHA-extractor",
			"nodeType": "pipeline",
			"nodeID": "4",
			"dependencies": [
				3,
				7
			],
			"previousSteps": [
				"#1",
				"#2"
			],
			"requests": [
				"POST"
			]
		},
		{
			"id": "ccx-data-pipeline",
			"nodeType": "pipeline",
			"nodeID": "5",
			"dependencies": [
				3
			],
			"previousSteps": [
				"#1"
			],
			"requests": []
		},
		{
			"id": "Insights-storage-broker",
			"nodeType": "service",
			"nodeID": "6",
			"dependencies": [
				3
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "S3-bucket",
			"nodeType": "bucket",
			"nodeID": "7",
			"dependencies": [
				6
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "Kafka-topic-ccx.ocp.results",
			"nodeType": "kafka",
			"nodeID": "8",
			"dependencies": [
				5
			],
			"previousSteps": [
				"#3"
			],
			"requests": []
		},
		{
			"id": "Insights-results-db-writer",
			"nodeType": "writer",
			"nodeID": "9",
			"dependencies": [
				8
			],
			"previousSteps": [
				"#4"
			],
			"requests": []
		},
		{
			"id": "AWS-RDS-DB",
			"nodeType": "database",
			"nodeID": "10",
			"dependencies": [
				9,
				11
			],
			"previousSteps": [
				"#5",
				"#10"
			],
			"requests": []
		},
		{
			"id": "Insights-results-aggregator",
			"nodeType": "service",
			"nodeID": "11",
			"dependencies": [
				10,
				12
			],
			"previousSteps": [
				"#6",
				"#9"
			],
			"requests": []
		},
		{
			"id": "ccx-smart-proxy",
			"nodeType": "proxy",
			"nodeID": "12",
			"dependencies": [
				11,
				13,
				14,
				15,
				17
			],
			"previousSteps": [
				"#7",
				"#8"
			],
			"requests": [
				"",
				"",
				"",
				"GET",
				"POST"
			]
		},
		{
			"id": "ccx-Insights-content-service",
			"nodeType": "service",
			"nodeID": "13",
			"dependencies": [],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "AMS",
			"nodeType": "proxy",
			"nodeID": "14",
			"dependencies": [
				12
			],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "API-v1",
			"nodeType": "API",
			"nodeID": "15",
			"dependencies": [
				12,
				16
			],
			"previousSteps": [],
			"requests": [
				"GET",
				"GET"
			]
		},
		{
			"id": "REST-API-consumers",
			"nodeType": "srcSink",
			"nodeID": "16",
			"dependencies": [
				15
			],
			"previousSteps": [],
			"requests": [
				"GET"
			]
		},
		{
			"id": "API-v2",
			"nodeType": "API",
			"nodeID": "17",
			"dependencies": [
				12,
				18
			],
			"previousSteps": [],
			"requests": [
				"POST",
				"POST"
			]
		},
		{
			"id": "Insights-Advisor",
			"nodeType": "srcSink",
			"nodeID": "18",
			"dependencies": [
				17
			],
			"previousSteps": [],
			"requests": [
				"POST"
			]
		},
		{
			"id": "notification-writer",
			"nodeType": "writer",
			"nodeID": "19",
			"dependencies": [
				8
			],
			"previousSteps": [
				"#11"
			],
			"requests": []
		},
		{
			"id": "Notification-DB",
			"nodeType": "database",
			"nodeID": "20",
			"dependencies": [
				19
			],
			"previousSteps": [
				"#12"
			],
			"requests": []
		},
		{
			"id": "Notification-rules",
			"nodeType": "config",
			"nodeID": "21",
			"dependencies": [],
			"previousSteps": [],
			"requests": []
		},
		{
			"id": "ccx-notification-service",
			"nodeType": "service",
			"nodeID": "22",
			"dependencies": [
				20,
				21
			],
			"previousSteps": [
				"#13",
				"#14"
			],
			"requests": []
		},
		{
			"id": "Kafka-topic-platform.notifications.ingress",
			"nodeType": "kafka",
			"nodeID": "23",
			"dependencies": [
				22
			],
			"previousSteps": [
				"#15"
			],
			"requests": []
		},
		{
			"id": "Customer",
			"nodeType": "customer",
			"nodeID": "24",
			"dependencies": [
				23
			],
			"previousSteps": [
				"#16"
			],
			"requests": []
		},
		{
			"id": "Kafka-topic-archive-results",
			"nodeType": "kafka",
			"nodeID": "25",
			"dependencies": [
				4
			],
			"previousSteps": [
				"#17"
			],
			"requests": [
				"POST"
			]
		},
		{
			"id": "archive-db-writer",
			"nodeType": "writer",
			"nodeID": "26",
			"dependencies": [
				25
			],
			"previousSteps": [
				"#18"
			],
			"requests": [
				"POST"
			]
		},
		{
			"id": "CVEs-database",
			"nodeType": "database",
			"nodeID": "27",
			"dependencies": [
				26
			],
			"previousSteps": [
				"#19"
			],
			"requests": [
				"POST"
			]
		}
	],
	"links": [
		{
			"source": "Insights-archive",
			"target": "Customer-cluster"
		},
		{
			"source": "Ingress-service",
			"target": "Insights-archive"
		},
		{
			"source": "Kafka-topic-platform.upload.buckit",
			"target": "Ingress-service"
		},
		{
			"source": "SHA-extractor",
			"target": "Kafka-topic-platform.upload.buckit"
		},
		{
			"source": "SHA-extractor",
			"target": "S3-bucket"
		},
		{
			"source": "ccx-data-pipeline",
			"target": "Kafka-topic-platform.upload.buckit"
		},
		{
			"source": "Insights-storage-broker",
			"target": "Kafka-topic-platform.upload.buckit"
		},
		{
			"source": "S3-bucket",
			"target": "Insights-storage-broker"
		},
		{
			"source": "Kafka-topic-ccx.ocp.results",
			"target": "ccx-data-pipeline"
		},
		{
			"source": "Insights-results-db-writer",
			"target": "Kafka-topic-ccx.ocp.results"
		},
		{
			"source": "AWS-RDS-DB",
			"target": "Insights-results-db-writer"
		},
		{
			"source": "AWS-RDS-DB",
			"target": "Insights-results-aggregator"
		},
		{
			"source": "Insights-results-aggregator",
			"target": "AWS-RDS-DB"
		},
		{
			"source": "Insights-results-aggregator",
			"target": "ccx-smart-proxy"
		},
		{
			"source": "ccx-smart-proxy",
			"target": "Insights-results-aggregator"
		},
		{
			"source": "ccx-smart-proxy",
			"target": "ccx-Insights-content-service"
		},
		{
			"source": "ccx-smart-proxy",
			"target": "AMS"
		},
		{
			"source": "ccx-smart-proxy",
			"target": "API-v1"
		},
		{
			"source": "ccx-smart-proxy",
			"target": "API-v2"
		},
		{
			"source": "AMS",
			"target": "ccx-smart-proxy"
		},
		{
			"source": "API-v1",
			"target": "ccx-smart-proxy"
		},
		{
			"source": "API-v1",
			"target": "REST-API-consumers"
		},
		{
			"source": "REST-API-consumers",
			"target": "API-v1"
		},
		{
			"source": "API-v2",
			"target": "ccx-smart-proxy"
		},
		{
			"source": "API-v2",
			"target": "Insights-Advisor"
		},
		{
			"source": "Insights-Advisor",
			"target": "API-v2"
		},
		{
			"source": "notification-writer",
			"target": "Kafka-topic-ccx.ocp.results"
		},
		{
			"source": "Notification-DB",
			"target": "notification-writer"
		},
		{
			"source": "ccx-notification-service",
			"target": "Notification-DB"
		},
		{
			"source": "ccx-notification-service",
			"target": "Notification-rules"
		},
		{
			"source": "Kafka-topic-platform.notifications.ingress",
			"target": "ccx-notification-service"
		},
		{
			"source": "Customer",
			"target": "Kafka-topic-platform.notifications.ingress"
		},
		{
			"source": "Kafka-topic-archive-results",
			"target": "SHA-extractor"
		},
		{
			"source": "archive-db-writer",
			"target": "Kafka-topic-archive-results"
		},
		{
			"source": "CVEs-database",
			"target": "archive-db-writer"
		}
	]
}