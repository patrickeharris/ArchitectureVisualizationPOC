export default [
    {source: 'ts-admin-user-service', target: 'ts-user-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments: '@RequestBody UserDto user, @RequestHeader HttpHeaders headers',
                returnData: 'ResponseEntity<Response>',
                endpointName: 'user.controller.UserController.updateUser'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'user.controller.UserController.getAllUser'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String userId, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'user.controller.UserController.deleteUserById'
            }
        ]
    },

    {source: 'ts-basic-service', target: 'ts-price-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String routeId, @PathVariable String trainType, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'price.controller.PriceController.query'
            }
        ]
    },

    {source: 'ts-basic-service', target: 'ts-train-service', strength: 0.1,
        functions: [
            {functionType: 'GET',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.retrieve'
            }
        ]
    },

    {source: 'ts-basic-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            {functionType: 'GET',
                arguments: '@PathVariable(value = #quot;stationNameForId#quot;) String stationName, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'fdse.microservice.controller.StationController.queryForStationId'
            }
        ]
    },

    {source: 'ts-basic-service', target: 'ts-route-service', strength: 0.1,
        functions: [
            {functionType: 'GET',
                arguments:  '@PathVariable String routeId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.queryById'
            }
        ]
    },

    {source: 'ts-cancel-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments: '@RequestBody Order orderInfo, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'order.controller.OrderController.saveOrderInfo'
            },
            { functionType: 'GET',
                arguments: '@PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'order.controller.OrderController.getOrderById'
            }
        ]
    },

    {source: 'ts-cancel-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@RequestBody Order orderInfo, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.saveOrderInfo'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.getOrderById'
            }
        ]
    },

    {source: 'ts-cancel-service', target: 'ts-notification-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody NotifyInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'boolean',
                endpointName:  'notification.controller.NotificationController.order_cancel_success'
            }
        ]
    },

    {source: 'ts-cancel-service', target: 'ts-inside-payment-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String userId, @PathVariable String money, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'inside_payment.controller.InsidePaymentController.drawBack'
            }
        ]
    },

    {source: 'ts-cancel-service', target: 'ts-user-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String userId, @RequestHeader HttpHeaders headers',
                returnData: 'ResponseEntity<Response>',
                endpointName: 'user.controller.UserController.getUserByUserId'
            }
        ]
    },

    {source: 'ts-travel2-service', target: 'ts-ticketinfo-service', strength: 0.1,
        functions: [
            {functionType: 'POST',
                arguments:  '@RequestBody Travel info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForTravel'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String name, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForStationId'
            }
        ]
    },

    {source: 'ts-travel2-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.getLeftTicketOfInterval'
            }
        ]
    },

    {source: 'ts-travel2-service', target: 'ts-train-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.retrieve'
            }
        ]
    },

    {source: 'ts-travel2-service', target: 'ts-route-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String routeId, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'route.controller.RouteController.queryById'
            }
        ]
    },

    {source: 'ts-travel2-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable Date travelDate, @PathVariable String trainNumber, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.calculateSoldTicket'
            }
        ]
    },

    {source: 'ts-travel-service', target: 'ts-ticketinfo-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Travel info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForTravel'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String name, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForStationId'
            }
        ]
    },

    {source: 'ts-travel-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.getLeftTicketOfInterval'
            }
        ]
    },

    {source: 'ts-travel-service', target: 'ts-train-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.retrieve'
            }
        ]
    },

    {source: 'ts-travel-service', target: 'ts-route-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String routeId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.queryById'
            }
        ]
    },

    {source: 'ts-travel-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable Date travelDate, @PathVariable String trainNumber, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.calculateSoldTicket'
            }
        ]
    },

    {source: 'ts-auth-service', target: 'ts-verification-code-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String verifyCode, HttpServletRequest request, HttpServletResponse response, @RequestHeader HttpHeaders headers',
                returnData: 'boolean',
                endpointName: 'verifycode.controller.VerifyCodeController.verifyCode'
            }
        ]
    },

    {source: 'ts-admin-basic-info-service', target: 'ts-config-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Config info, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity<?>',
                endpointName:  'config.controller.ConfigController.createConfig'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody Config info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'config.controller.ConfigController.updateConfig'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'config.controller.ConfigController.queryAll'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String configName, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'config.controller.ConfigController.deleteConfig'
            }
        ]
    },

    {source: 'ts-admin-basic-info-service', target: 'ts-price-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody PriceConfig info, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity<?>',
                endpointName:  'price.controller.PriceController.create'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody PriceConfig info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'price.controller.PriceController.update'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'price.controller.PriceController.queryAll'
            },
            { functionType: 'DELETE',
                arguments:  '@RequestBody PriceConfig info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'price.controller.PriceController.delete'
            }
        ]
    },

    {source: 'ts-admin-basic-info-service', target: 'ts-train-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments: '@RequestBody TrainType trainType, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.create'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody TrainType trainType, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.update'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.query'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'train.controller.TrainController.delete'
            }
        ]
    },

    {source: 'ts-admin-basic-info-service', target: 'ts-contacts-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Contacts aci, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity<?>',
                endpointName:  'contacts.controller.ContactsController.createNewContactsAdmin'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody Contacts info, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity',
                endpointName:  'contacts.controller.ContactsController.modifyContacts'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity',
                endpointName:  'contacts.controller.ContactsController.getAllContacts'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String contactsId, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity',
                endpointName:  'contacts.controller.ContactsController.deleteContacts'
            }
        ]
    },

    {source: 'ts-admin-basic-info-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Station station, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'fdse.microservice.controller.StationController.create'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody Station station, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.update'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.query'
            },
            { functionType: 'DELETE',
                arguments:  '@RequestBody Station station, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'fdse.microservice.controller.StationController.delete'
            }
        ]
    },

    {source: 'ts-security-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable Date checkDate, @PathVariable String accountId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.securityInfoCheck'
            }
        ]
    },

    {source: 'ts-security-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable Date checkDate, @PathVariable String accountId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.securityInfoCheck'
            }
        ]
    },

    {source: 'ts-user-service', target: 'ts-auth-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody AuthDto authDto',
                returnData:  'HttpEntity<Response>',
                endpointName:  'auth.controller.AuthController.createDefaultUser'
            }
        ]
    },

    {source: 'ts-execute-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@PathVariable String orderId, @PathVariable int status, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.modifyOrder'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.getOrderById'
            }
        ]
    },

    {source: 'ts-execute-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@PathVariable String orderId, @PathVariable int status, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.modifyOrder'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String orderId, @PathVariable int status, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.getOrderById'
            }
        ]
    },

    {source: 'ts-ticketinfo-service', target: 'ts-basic-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Travel info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.BasicController.queryForTravel'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String stationName, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.BasicController.queryForStationId'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-travel2-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody TripAllDetailInfo gtdi, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel2.controller.Travel2Controller.getTripAllDetailInfo'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-ticketinfo-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Travel info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForTravel'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-food-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody FoodOrder addFoodOrder, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'foodsearch.controller.FoodController.createFoodOrder'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.create'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-consign-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Consign request, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'consign.controller.ConsignController.insertConsign'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-notification-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody NotifyInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'boolean',
                endpointName:  'notification.controller.NotificationController.preserve_success'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Order createOrder, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.createNewOrder'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-assurance-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable int typeIndex, @PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'assurance.controller.AssuranceController.createNewAssurance'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-contacts-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity',
                endpointName:  'contacts.controller.ContactsController.getContactsByContactsId'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable(value = #quot;stationNameForId#quot;) String stationName, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'fdse.microservice.controller.StationController.queryForStationId'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-security-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String accountId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'security.controller.SecurityController.check'
            }
        ]
    },

    {source: 'ts-preserve-other-service', target: 'ts-user-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String userId, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'user.controller.UserController.getUserByUserId'
            }
        ]
    },

    {source: 'ts-admin-travel-service', target: 'ts-travel2-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments: '@RequestBody TravelInfo info, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'travel2.controller.Travel2Controller.updateTrip'
            },
            { functionType: 'POST',
                arguments: '@RequestBody TravelInfo routeIds, @RequestHeader HttpHeaders headers',
                returnData: 'HttpEntity<?>',
                endpointName: 'travel2.controller.Travel2Controller.createTrip'
            },
            { functionType: 'GET',
                arguments: '@RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'travel2.controller.Travel2Controller.adminQueryAll'
            },
            { functionType: 'DELETE',
                arguments: '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'travel2.controller.Travel2Controller.deleteTrip'
            }
        ]
    },

    {source: 'ts-admin-travel-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@RequestBody TravelInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.updateTrip'
            },
            { functionType: 'POST',
                arguments:  '@RequestBody TravelInfo routeIds, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity<?>',
                endpointName:  'travel.controller.TravelController.createTrip'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.adminQueryAll'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.deleteTrip'
            }
        ]
    },

    {source: 'ts-admin-route-service', target: 'ts-route-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody RouteInfo createAndModifyRouteInfo, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'route.controller.RouteController.createAndModifyRoute'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.queryAll'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String routeId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.deleteRoute'
            }
        ]
    },

    {source: 'ts-route-plan-service', target: 'ts-travel2-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody TripInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel2.controller.Travel2Controller.queryInfo'
            },
            { functionType: 'GET',
                arguments:  '@RequestBody ArrayList<String> routeIds, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel2.controller.Travel2Controller.getTripsByRouteId'
            }
        ]
    },

    {source: 'ts-route-plan-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody TripInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.queryInfo'
            },
            { functionType: 'GET',
                arguments:  '@RequestBody ArrayList<String> routeIds, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.getTripsByRouteId'
            }
        ]
    },

    {source: 'ts-route-plan-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable(value = #quot;stationNameForId#quot;) String stationName, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForStationId'
            }
        ]
    },

    {source: 'ts-route-plan-service', target: 'ts-route-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@PathVariable String routeId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.queryById'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String startId, @PathVariable String terminalId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'route.controller.RouteController.queryByStartAndTerminal'
            }
        ]
    },

    {source: 'ts-order-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody List<String> stationIdList, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForNameBatch'
            }
        ]
    },

    {source: 'ts-consign-service', target: 'ts-consign-price-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String weight, @PathVariable String isWithinRegion, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'consignprice.controller.ConsignPriceController.getPriceByWeightAndRegion'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-ticketinfo-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Travel info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForTravel'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody TripAllDetailInfo gtdi, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.getTripAllDetailInfo'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.create'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-food-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody FoodOrder addFoodOrder, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'foodsearch.controller.FoodController.createFoodOrder'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Order createOrder, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.createNewOrder'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-consign-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Consign request, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'consign.controller.ConsignController.insertConsign'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-notification-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody NotifyInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'boolean',
                endpointName:  'notification.controller.NotificationController.preserve_success'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-assurance-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@PathVariable int typeIndex, @PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'assurance.controller.AssuranceController.createNewAssurance'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-contacts-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String id, @RequestHeader HttpHeaders headers',
                returnData:  'HttpEntity',
                endpointName:  'contacts.controller.ContactsController.getContactsByContactsId'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable(value = #quot;stationNameForId#quot;) String stationName, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForStationId'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-security-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String accountId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'security.controller.SecurityController.check'
            }
        ]
    },

    {source: 'ts-preserve-service', target: 'ts-user-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String userId, @RequestHeader HttpHeaders headers',
                returnData:  'ResponseEntity<Response>',
                endpointName:  'user.controller.UserController.getUserByUserId'
            }
        ]
    },

    {source: 'ts-order-other-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody List<String> stationIdList, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForNameBatch'
            }
        ]
    },

    {source: 'ts-food-service', target: 'ts-food-map-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody List<String> stationIdList',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'food.controller.FoodStoreController.getFoodStoresByStationIds'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'food.controller.TrainFoodController.getTrainFoodOfTrip'
            }
        ]
    },

    {source: 'ts-food-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.getRouteByTripId'
            }
        ]
    },

    {source: 'ts-food-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable(value = #quot;stationNameForId#quot;) String stationName, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForStationId'
            }
        ]
    },

    {source: 'ts-rebook-service', target: 'ts-inside-payment-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody PaymentInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'inside_payment.controller.InsidePaymentController.payDifference'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String userId, @PathVariable String money, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'inside_payment.controller.InsidePaymentController.drawBack'
            }
        ]
    },

    {source: 'ts-rebook-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.create'
            }
        ]
    },

    {source: 'ts-rebook-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable(value = #quot;stationIdForName#quot;) String stationId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryById'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-travel2-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments: '@RequestBody TripInfo info, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'travel2.controller.Travel2Controller.queryInfo'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody TripInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.queryInfo'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-seat-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'seat.controller.SeatController.getLeftTicketOfInterval'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-station-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody List<String> stationIdList, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'fdse.microservice.controller.StationController.queryForNameBatch'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-route-plan-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody RoutePlanInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'plan.controller.RoutePlanController.getCheapestRoutes'
            },
            { functionType: 'GET',
                arguments:  '@RequestBody RoutePlanInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'plan.controller.RoutePlanController.getMinStopStations'
            },
            { functionType: 'GET',
                arguments:  '@RequestBody RoutePlanInfo info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'plan.controller.RoutePlanController.getQuickestRoutes'
            }
        ]
    },

    {source: 'ts-travel-plan-service', target: 'ts-ticketinfo-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String name, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'ticketinfo.controller.TicketInfoController.queryForStationId'
            }
        ]
    },

    {source: 'ts-admin-order-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Order order, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.addcreateNewOrder'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody Order order, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.updateOrder'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.findAllOrder'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.deleteOrder'
            }
        ]
    },

    {source: 'ts-admin-order-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Order order, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.addcreateNewOrder'
            },
            { functionType: 'PUT',
                arguments:  '@RequestBody Order order, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.updateOrder'
            },
            { functionType: 'GET',
                arguments:  '@RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.findAllOrder'
            },
            { functionType: 'DELETE',
                arguments:  '@PathVariable String orderId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.deleteOrder'
            }
        ]
    },

    {source: 'ts-inside-payment-service', target: 'ts-payment-service', strength: 0.1,
        functions: [
            { functionType: 'POST',
                arguments:  '@RequestBody Payment info, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'com.trainticket.controller.PaymentController.pay'
            }
        ]
    },

    {source: 'ts-inside-payment-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@PathVariable String orderId, @PathVariable int status, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.modifyOrder'
            }
        ]
    },

    {source: 'ts-inside-payment-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'PUT',
                arguments:  '@PathVariable String orderId, @PathVariable int status, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.modifyOrder'
            }
        ]
    },

    {source: 'ts-seat-service', target: 'ts-order-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'order.controller.OrderController.getTicketListByDateAndTripId'
            }
        ]
    },

    {source: 'ts-seat-service', target: 'ts-order-other-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@RequestBody Seat seatRequest, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'other.controller.OrderOtherController.getTicketListByDateAndTripId'
            }
        ]
    },

    {source: 'ts-seat-service', target: 'ts-config-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments: '@PathVariable String configName, @RequestHeader HttpHeaders headers',
                returnData: 'org.springframework.http.HttpEntity',
                endpointName: 'config.controller.ConfigController.retrieve'
            }
        ]
    },

    {source: 'ts-seat-service', target: 'ts-travel2-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel2.controller.Travel2Controller.getRouteByTripId'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel2.controller.Travel2Controller.getTrainTypeByTripId'
            }
        ]
    },

    {source: 'ts-seat-service', target: 'ts-travel-service', strength: 0.1,
        functions: [
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.getRouteByTripId'
            },
            { functionType: 'GET',
                arguments:  '@PathVariable String tripId, @RequestHeader HttpHeaders headers',
                returnData:  'org.springframework.http.HttpEntity',
                endpointName:  'travel.controller.TravelController.getTrainTypeByTripId'
            }
        ]
    }
]