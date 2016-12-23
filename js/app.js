var app = angular.module('ToDoListApp', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl: "views/taskList.html",
            controller: "HomeController"
        })
        .when("/addTask",{
            templateUrl: "views/addTask.html",
            controller: "ToDoListItemsController"
        })
        .when("/addTask/edit/:id",{
            templateUrl: "views/addTask.html",
            controller: "ToDoListItemsController"
        })
        .otherwise({
            redirectTo: "/"
        })
});

app.service("TaskService", function(){

    var taskService = {};

    taskService.taskItems = [
    	{id: 1, completed: true, itemName: 'Call Amma', date: new Date("DEcember 12, 2016 11:13:00")},
        {id: 2, completed: true, itemName: 'Bake', date: new Date("October 1, 2016 11:13:00") },
        {id: 3, completed: true, itemName: 'Knit', date: new Date("October 16, 2016 11:13:00") }
      ];

     taskService.findById=function(id){
     	for(var item in taskService.taskItems)
     	{
     		if(taskService.taskItems[item].id === id)
     		{
     			return taskService.taskItems[item];
     		}
     	}
     };

    taskService.getNewId = function(){

        if(taskService.newId)
        {
            taskService.newId++;
            return taskService.newId;
        }
        else
        {
            var maxId = _.max(taskService.taskItems, function(entry){ return entry.id;})
            taskService.newId = maxId.id + 1;
            return taskService.newId;
        }
    };
    taskService.markCompleted = function(entry){
        entry.completed = !entry.completed;
    };
    taskService.removeItem=function(entry)
    {
        var index=taskService.taskItems.indexOf(entry);
        taskService.taskItems.splice(index,1);
    };

    taskService.save = function(entry){
    	var updatedItem=taskService.findById(entry.id);
    	if(updatedItem)
    	{
    		updatedItem.completed=entry.completed;
    		updatedItem.itemName=entry.itemName;
    		updatedItem.date=entry.date;
    		
    	}
    	else
    	{
    		entry.id = taskService.getNewId();
        	taskService.taskItems.push(entry);
    	}
        
    };


    return taskService;

});

app.controller("HomeController", ["$scope","TaskService", function($scope,TaskService) {

    $scope.taskItems = TaskService.taskItems;
    $scope.removeItem=function(entry)
    {
        TaskService.removeItem(entry);
    };
    $scope.markCompleted = function(entry){
            TaskService.markCompleted(entry);
    };

}]);

app.controller("ToDoListItemsController", ["$scope", "$routeParams", "$location", "TaskService", function($scope, $routeParams, $location, TaskService){

    if(!$routeParams.id)
    {
    	$scope.taskItem = {id: 0, completed: false, itemName: "", date: new Date()};
    }
    else
    {
    	$scope.taskItem = _.clone(TaskService.findById(parseInt($routeParams.id)));
    }

    
    $scope.save = function(){
        TaskService.save( $scope.taskItem );
        $location.path("/");
    };

    

}]);