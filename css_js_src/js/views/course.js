CourseListView = Backbone.View.extend({
    tagName: "ul",
    el: '.course-view',
    initialize: function(){
        _.bindAll(this, "renderItem", "loadResults");
        this.courseList = new CourseList();
    },

    renderItem: function(model){
        var courseItemView = new CourseItemView({model: model});
        courseItemView.render();
        $(this.el).append(courseItemView.el);
    },

    render: function(){
        this.loadResults();
    },

    loadResults: function () {
        var that = this;
        // we are starting a new load of results so set isLoading to true
        this.isLoading = true;
        // fetch is Backbone.js native function for calling and parsing the collection url
        this.courseList.fetch({
            success: function (courses) {
                // Once the results are returned lets populate our template
                console.log(courses.models);
                for(model in courses.models)
                {
                    that.renderItem(courses.models[model])
                }
            }
        });
    }
});

CourseItemView = Backbone.View.extend({
    tagName: "li",
    events: {
        "click a#show": "clicked",
        "click #update": "update"
    },

    initialize: function(){
        _.bindAll(this, "clicked", "render", "update");
    },

    clicked: function(e){
        e.preventDefault();
        var detail_shown = $(this.el).data('detail')
        if(detail_shown){
            $(this.el).children("#item-detail").remove()
            $(this.el).children("#item-add").remove()
            $(this.el).data('detail', false)
        } else {
            var item_template = $('#course-item-detail-template');
            var html = (_.template(item_template.html(), {course: this.model, _:_}));
            var update_template = $('#course-item-add-template');
            console.log(this.model.toJSON());
            var update_html = (_.template(update_template.html(), {course: this.model.toJSON(), _:_}));
            $(this.el).append(html);
            $(this.el).append(update_html)
            $(this.el).data('detail', true)
        }
    },

    render: function(){
        var item_template = $('#course-item-template');
        var html = (_.template(item_template.html(), {course: this.model, _:_}));
        $(this.el).append(html);
        $(this.el).data('detail', false)
    },

    update: function() {
        var update_elements = $(this.el).children('#item-add').children('.update');
        var update_dict = {};
        for(var el in update_elements)
        {
            var id = update_elements[el].id;
            var value=update_elements[el].value;
            if(id!="id" && id!="" && value!="" && id!="modified" && id!="created" && id!="resource_uri")
            {
                update_dict[id] = value;
            }
        }
        console.log(update_dict);
        this.model.save(update_dict, {patch: true});
    }
});

$(document).ready(function() {
    var view = new CourseListView();
    view.render();
});