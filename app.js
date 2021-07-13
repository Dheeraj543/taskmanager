let todos=[];
const filters={
    searchText: '',
    hideCompleted: false
}
$('.search-todo').on('input',()=>{
    filters.searchText=$('.search-todo').val();
    createList(todos,filters);
})
const renderTodos=function(){
    console.log("render");
    db.collection('keepnote').get().then(data =>{
        data.docs.forEach(element => {
            const singleTodo=element.data();
            todos.push(singleTodo);
        });
        console.log("rendertodos");
        createList(todos,filters);
        
    });
}
const createList= function(todos,filters){
    let count=0;
    console.log(todos);
    const filteredTodos= $.grep(todos,element=>{
        return element.name.toLowerCase().includes(filters.searchText.toLowerCase());
    })
    $('.todos').empty();
    filteredTodos.forEach(element=>{
        let divElement=$('<div class="form-check card singleTodo">');
        let buttonElement=$('<button class="btncustom btn btn-danger float-right">');
        let labelElement=$('<label class="form-check-label">');
        let checkboxElement=$('<input type="checkbox" class="form-check-input"/>');
        let cardBodyElement=$('<div class="card-body">');
        buttonElement.text('X');
        buttonElement.on('click',()=>{
            console.log('event trigegrefg',element);
            deleteTodo(element);
        })
        checkboxElement.attr("checked",element.isCompleted);
        checkboxElement.on('change',()=>{
        //    console.log("checked");
            toggleTodo(element);
        })
        labelElement.append(checkboxElement);
        labelElement.append('<span>'+element.name+'</span');
        cardBodyElement.append(labelElement);
        cardBodyElement.append(buttonElement);
        divElement.append(cardBodyElement);
        
        $('.todos').append(divElement);
        if(element.isCompleted==false){
            count++;
        }
    })
    $('.status').text("You have "+count+" todos left");
}

const toggleTodo=function(element){
    const new_todo={
        id: element.id,
        isCompleted:!element.isCompleted,
        name: element.name
    }
    db.collection('keepnote').doc(element.id).update(new_todo).then(()=>{
        console.log("Updated succesfully");
        element.isCompleted=!element.isCompleted;
    createList(todos,filters);
    }).catch(error=>{
        console.log("Error occured",error);
    })
    /*
    
    */
}

const deleteTodo = function(element){
    db.collection('keepnote').doc(element.id).delete().then(()=>{
        console.log("Todo deleted");
    
    const todoIndex=todos.findIndex(todo=>todo.id==element.id);
    if(todoIndex!=-1){
        todos.splice(todoIndex,1);
        createList(todos,filters);
    }
});
}
$('.submit-todo').click((event)=>{
    event.preventDefault();
    const id=uuidv4();
    console.log("hehe");
    const todo={
        name: $('.new-todo').val(),
        isCompleted:false,
        id:id
    }
    db.collection('keepnote').doc(id).set(todo).then(()=>{
        console.log('todoasdded');
        $('.new-todo').val('');
        todos.push(todo);
        createList(todos,filters);
    }).catch(error=>{
        console.log("error",e);
    })
})
$('.hidecompleted').on("change",()=>{
    console.log("haa");

    if($('.hidecompleted').prop("checked")){
        hideCompleted(todos,filters);
    }
    else{
        createList(todos,filters);
    }
})
const hideCompleted=function(todos,filters){
    console.log("nooo");
    const filterTodos=$.grep(todos,(element)=>{
        if(element.isCompleted==filters.hideCompleted){
            return element;
        }
    })
    createList(filterTodos,filters);
}
renderTodos();