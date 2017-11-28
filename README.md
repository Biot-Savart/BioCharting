# BioCharting
Easy to use animated charting library using D3js

A sample page can be accessed here: https://biot-savart.github.io/BioCharting/index.html

## Available Charts
### Pie

![Pie Chart](https://github.com/Biot-Savart/BioCharting/blob/develop/images/pie.PNG?raw=true)

### Donut

![Donut Chart](https://github.com/Biot-Savart/BioCharting/blob/develop/images/donut.PNG?raw=true)

## Implementation
```javascript
	$.getJSON( "https://raw.githubusercontent.com/Biot-Savart/BioCharting/develop/MOCK_DATA.json", function( data ) {
      
            addPie(data, '#pieChartDiv',360,360);
    		addDonut(data, '#donutChartDiv');
           
          });
```

