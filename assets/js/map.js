$(function() {
    // 动态加载 china.js 并注册地图
    $.getScript('assets/js/china.js', function() {
        console.log("China.js loaded successfully.");
        
        echarts.registerMap('china', china);
        
        // 初始化 ECharts 图表
        var myChart = echarts.init(document.getElementById('main'));

        // 获取表格对象
        let table = $("#tbody");

        // 发送ajax请求获取json文件的数据
        $.ajax({
            url: "./assets/json/Walls_Quantitative.json", // json文件位置
            type: "GET",
            dataType: "json",
            success: function(data) {
                console.log("Data fetched successfully:", data);

                let res = [];
                for (let i = 0; i < data.length; i++) {
                    res.push({
                        name: data[i].name,
                        value: data[i].value,
                        sales: data[i].Sales
                    });
                }

                dealWithData(res);

                // 处理表格内容
                let row = [];
                for (let i = 0; i < data.length; i++) {
                    let name = data[i].name;
                    let sales = data[i].Sales;
                    row.push("<tr><td>" + name + "</td><td>" + sales + "</td></tr>");
                }
                table.append(row.join(""));
            },
            error: function(error) {
                console.error("Error fetching data:", error);
            }
        });

        function dealWithData(data) {
            let option = {
                title: {
                    text: '设备销量',
                    x: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: "40"
                    }
                },
                tooltip: {
                    show: true,
                    triggerOn: 'click'
                },
                geo: {
                    map: 'china',
                    roam: false,
                    zoom: 1.235,
                    center: [105, 36],
                    itemStyle: {
                        areaColor: '#f5f2f2',
                        borderColor: "#835f5f",
                    },
                    label: {
                        normal: {
                            show: true,
                            fontSize: "11.5",
                            color: "rgb(107,102,102)"
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: '#d0a3a3',
                        },
                        label: {
                            show: true,
                            color: "rgb(255,255,255)"
                        }
                    }
                },
                series: [{
                    name: '销量',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: data,
                    symbolSize: 12,
                    itemStyle: {
                        color: "#f13434",
                        shadowBlur: 2,
                        shadowColor: "#333"
                    },
                    tooltip: {
                        formatter: function(params) {
                            return "<b>销量</b><br>" + params.data.name + ": " + params.data.sales;
                        }
                    }
                }, {
                    name: "产品销量",
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    data: data,
                    symbolSize: 6,
                    showEffectOn: "render",
                    rippleEffect: {
                        brushType: "stroke",
                        color: "#f13434",
                        period: 10,
                        scale: 10
                    },
                    hoverAnimation: true,
                    label: {
                        formatter: "{b}",
                        position: "top",
                        show: true,
                        fontSize: "10",
                    },
                    itemStyle: {
                        color: "#f13434",
                        shadowBlur: 2,
                        shadowColor: "#333"
                    },
                    tooltip: {
                        formatter: function(params) {
                            return "<b>销量</b><br>" + params.data.name + ": " + params.data.sales;
                        }
                    },
                    zlevel: 1
                }]
            };
            myChart.setOption(option);
            console.log("Chart options set successfully.");
        }

        // 点击事件处理函数
        myChart.on('click', function(param) {
            if (param.data) {
                console.log("城市：" + param.data.name + "; 坐标：" + param.data.value + "; 销量：" + param.data.sales);
            }
        });
    }).fail(function(jqxhr, settings, exception) {
        console.error("Failed to load China.js:", exception);
    });
});