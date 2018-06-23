    $(document).ready(function(){
        $(".prev").click(function(){
            var value = $("#active").text();
            if(value <= 1)
                $("a").attr("href", "#");
            else{
                var pagePrev = +value - 1;
                window.location.href = '?page=' + pagePrev;
            }
        })
    });
    $(document).ready(function(){
        $(".next").click(function(){
            var value = $("#active").text();
            var pageLast = $('.pagination li:nth-last-child(2)').text();
            if(value >= pageLast)
                $("a").attr("href", "#");
            else{
                var pageNext = +value + 1;
                window.location.href = '?page=' + pageNext;
            }
        })
    });
