﻿(function () {
    'use static';

    angular.module('motivaBici', [])
        .controller('MainCtrl', MainCtrl);

        function MainCtrl() {

            var vm = this;
            vm.showDiv = false;
            vm.showProfileBool = false;
            vm.user = {
                    "secondLastName": "",
                    "firstName": "Alfonso",
                    "dateBirth": "1996-09-05",
                    "secondName": "",
                    "routes": [
                        {
                            "source": {
                                "lat": 7.125825,
                                "lng": -73.118542
                            },
                            "kms": {
                                "text": "20.2 km",
                                "value": 20180
                            },
                            "duration": {
                                "text": "28 mins",
                                "value": 1690
                            },
                            "averageVel": 11,
                            "dateRoute": "2016-03-19",
                            "destination": {
                                "lat": 7.128542,
                                "lng": -73.18103
                            },
                            "calories": 399,
                            "minAltitude": 706.70172119140625,
                            "maxAltitude": 1192.323852539062
                        },
                        {
                            "source": {
                                "lat": 7.103321,
                                "lng": -73.121125
                            },
                            "kms": {
                                "text": "12.0 km",
                                "value": 11981
                            },
                            "duration": {
                                "text": "40 mins",
                                "value": 2371
                            },
                            "averageVel": 5,
                            "dateRoute": "2016-03-16",
                            "destination": {
                                "lat": 7.083082,
                                "lng": -73.067868
                            },
                            "calories": 370,
                            "minAltitude": 895.4510498046875,
                            "maxAltitude": 1460.96533203125
                        },
                        {
                            "source": {
                                "lat": 7.118535,
                                "lng": -73.111311
                            },
                            "kms": {
                                "text": "41.0 km",
                                "value": 40996
                            },
                            "duration": {
                                "text": "1 hour 8 mins",
                                "value": 4058
                            },
                            "averageVel": 10,
                            "dateRoute": "2016-12-14",
                            "destination": {
                                "lat": 6.858842,
                                "lng": -73.065242
                            },
                            "calories": 265,
                            "minAltitude": 893.845703125,
                            "maxAltitude": 1685.906860351562
                        },
                        {
                            "source": {
                                "lat": 7.125825,
                                "lng": -73.118542
                            },
                            "kms": {
                                "text": "20.5 km",
                                "value": 20497
                            },
                            "duration": {
                                "text": "28 mins",
                                "value": 1686
                            },
                            "averageVel": 12,
                            "dateRoute": "2016-05-03",
                            "destination": {
                                "lat": 7.111268,
                                "lng": -73.215631
                            },
                            "calories": 105,
                            "minAltitude": 704.16583251953125,
                            "maxAltitude": 1102.329833984375
                        }
                    ],
                    "password": "password",
                    "email": "usuario@correo.com",
                    "firstLastName": "Lizarazo",
                    "sex": "male"
                };
            vm.routes = vm.user.routes;

            var kmsTotal = 0;

            vm.routes.forEach(function (a) {
                kmsTotal += a.kms.value;
            });

            vm.kmsTotal = Math.round((kmsTotal/1000)*100)/100;

            vm.routes.forEach(function (a) {
                a.maxAltitude = Math.round((a.maxAltitude)*100)/100;
                a.minAltitude = Math.round((a.minAltitude)*100)/100;
                a.mtsUp = Math.round((a.maxAltitude - a.minAltitude)*100)/100;
                a.mtsDown = Math.round((a.minAltitude)*100)/100;
                a.averageVel = Math.round((a.averageVel*0.06)*100)/100;
            })

            vm.routes.sort(function(a,b){
                return new Date(b.dateRoute) - new Date(a.dateRoute);
            });

            vm.showProfile = function () {
                vm.showDiv = false;
                vm.showProfileBool = true;
            };

            vm.saveProfile = function (user) {
                console.log(user);
            }

            vm.showRoute = function (index, route) {
                vm.selected = index;
                vm.showProfileBool = false;
                vm.showDiv = true;
                vm.route = route;
                //Creación del mapa
                var mapElement = document.getElementById('map');
                var map = new google.maps.Map(mapElement, {
                    center : route.source,
                    zoom : 16
                });
                //Creación de las direcciones
                var directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                new google.maps.DirectionsService().route(
                    {
                        origin : route.source,
                        destination : route.destination,
                        travelMode : google.maps.TravelMode.DRIVING
                    },
                    function (result) {
                    directionsDisplay.setDirections(result);

                    var elevations = new google.maps.ElevationService;
                    elevations.getElevationAlongPath({
                        'path' : result.routes[0].overview_path,
                        'samples' : 100
                    }, function (elevations) {
                        //Se obtienen las elevaciones a lo largo del recorrido, samples es el número de elevaciones obtenidas
                        var elevations_x = [];
                        var elevations_y = [];
                        elevations.forEach(function (a) {
                            elevations_x.push(Math.round(a.elevation*100)/100);
                            elevations_y.push("");
                        });
                        //Configuración de la gráfica
                        var chart = document.getElementById('chart_topography');
                        new Chart(chart, {
                            type: 'line',
                            data: {
                                labels: elevations_y,
                                datasets: [{
                                    data: elevations_x,
                                    linetension: 0,
                                    backgroundColor: '#00284F',
                                    borderCapStyle: 'butt',
                                    pointBackgroundColor: "#fff",
                                    pointBorderWidth: 0,
                                    pointHoverRadius: 0,
                                    borderDashOffset: 0.0,
                                    pointRadius: 0,
                                    pointHitRadius: 0,
                                }]
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: "Altimetría del recorrido"
                                },
                                scales: {
                                    xAxes: [{
                                        display: false
                                    }],
                                    yAxes: [{
                                        beginAtZero: false
                                    }]
                                }
                            }
                        })
                    })

                });
            };

            vm.close = function () {
                vm.showDiv = false;
            };

        }
})();
