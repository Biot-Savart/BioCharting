# BioCharting
Easy to use charting library using 3djs

## Available Charts
> - Pie
> - Donut

## Implementation
```javascript
	$.getJSON( "https://raw.githubusercontent.com/Biot-Savart/BioCharting/develop/MOCK_DATA.json", function( data ) {
      
            addPie(data, '#pieChartDiv',360,360);
    		addDonut(data, '#donutChartDiv');
           
          });
'''

