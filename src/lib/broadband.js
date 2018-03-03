import fs from 'fs';
import _ from 'lodash';

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

const getCombinations = (items, connections, item, currentConnections, currentItems, currentTypes) => {
	const nodes = getNodes(currentConnections, item.name);

	let plans = [currentItems];
	if(nodes.length > 0){
		nodes.map((node) => {
			currentConnections = rmConnection(currentConnections, node);	

			let newItem = {};

			if(node.a == item.name){
				newItem = getItem(items, node.b);
			} else {
				newItem = getItem(items, node.a);
			}

			plans.map((plan) => {
				if(!getTypes(items, plan).includes(newItem.type) || (newItem.type == 'addon' && !plan.includes(newItem.name))){
					plans = plans.concat(
						getCombinations(items, connections, newItem, currentConnections, plan.concat(newItem.name), plan.concat(newItem.type)));

				}
			})
							
		})
	}
    return plans;
}

const planMount  = (items, connections, combinations) => {
	let plans = {};

	combinations.map((combination) => {
		let plan = {};

		combination = sortByItems(items, combination);

		if(plans[combination.join(" + ")] == undefined){
			plans[combination.join(" + ")]  = planStruct();
		}

		plans[combination.join(" + ")] = getData(items, connections, combination)

	})

	return plans;
}

const getData = (items, connections, combination) => {
	const name = combination.join(" + ");
	let total = 0;
	let diff = 0;
	let planItems = [];
	let numConnections = combination.length - 1;	
	let a = combination[0];

	combination.map((itemName, i) => {
		let item = getItem(items, itemName);
		let b = combination[i+1];	

		total += Number(item.price);
		if(numConnections){
			let connection = false;
			while(connection == false){
				connection = getConnection(connections, {a: a, b: b});

				if(connection != undefined){
					total += Number(connection.value);
					diff += Number(connection.value);
					numConnections--;
					connection = true;
				} else {
					a = combination[combination.indexOf(a) + 1];
					connection = false;
				}
			}					
			
		}

		planItems.push(item)
	})

	return { 
		name,
		total: total.toFixed(2),
		diff: diff.toFixed(2),
		items: planItems
	}
}

const planStruct = () => {
	return { 
		name: '',
		total: 0,
		diff: 0,
		items: []
	}
}

const sortByItems = (items, combination) => {
	let combinationNew = [];
	let orderedItems = items.map((item) => item.name)

	combination.map((itemName) => { combinationNew[orderedItems.indexOf(itemName)] = itemName })

	combinationNew.clean();

	return combinationNew;
}

const getItem = (items, name) => {
    return items.filter((item) => {
    	return item.name == name 
    })[0];
}

const getTypes = (items, plan) => {
    return plan.map((itemPlan) => {
    	return items.filter((item) => {
    		return item.name == itemPlan
    	})[0].type
    });
}

const getBroadbands = (items) => {
    return items.filter((item) => {
    	return item.type == 'bb' 
    });
}

const getNodes = (connections, node) => {
    return connections.filter((connection) => {
    	return connection.a == node || connection.b == node;
    });
}

const getConnection = (connections, node) => {
    return connections.filter((connection) => {
    	return (connection.a == node.a && connection.b == node.b) || (connection.a == node.b && connection.b == node.a);
    })[0];
}

const rmConnection = (connections, node) => {
    return connections.filter((connection) => {
    	return !(connection.a == node.a && connection.b == node.b);
    });
}


export { 
	getBroadbands, getCombinations, planMount
}
