
angular.module('newApp').factory('Notification', function($http,serverConfig) {
    return {
        // get all the Inbox Messages
        generate : function(position, container, content, confirm) {
            /*return $http({
                method: 'GET',
                url: serverConfig.address+'awsUpload'
            });*/
            NotifContent = $('#preview').find('.alert').html(),
                autoClose = true;
            type = 'success';
            notifContent = '<div class="alert alert-success media fade in"><p><strong>Well done!</strong> You successfully read this important alert message.</p></div>';
            method = 3000;
            position = 'top';
            container = '';
            style = 'topbar';

            console.log(position,container,content,confirm);
            if (position == 'bottom') {
                openAnimation = 'animated fadeInUp';
                closeAnimation = 'animated fadeOutDown';
            }
            else if (position == 'top') {
                openAnimation = 'animated fadeIn';
                closeAnimation = 'animated fadeOut';
            }
            else {
                openAnimation = 'animated bounceIn';
                closeAnimation = 'animated bounceOut';
            }

            if (container == '') {

                var n = noty({
                    text: content,
                    type: type,
                    dismissQueue: true,
                    layout: position,
                    closeWith: ['click'],
                    theme: 'made',
                    maxVisible: 10,
                    animation: {
                        open: openAnimation,
                        close: closeAnimation,
                        easing: 'swing',
                        speed: 100
                    },
                    timeout: method,
                    buttons: confirm ? [
                        {
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            noty({
                                dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Ok" button', animation: {
                                    open: 'animated bounceIn', close: 'animated bounceOut'
                                }, type: 'success', timeout: 3000
                            });
                            confirm = false;
                        }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                            $noty.close();
                            noty({
                                dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Cancel" button', animation: {
                                    open: 'animated bounceIn', close: 'animated bounceOut'
                                }, type: 'error', timeout: 3000
                            });
                            confirm = false;
                        }
                        }
                    ] : '',
                    callback: {
                        onShow: function () {
                            leftNotfication = $('.sidebar').width();
                            if ($('body').hasClass('rtl')) {
                                if (position == 'top' || position == 'bottom') {
                                    $('#noty_top_layout_container').css('margin-right', leftNotfication).css('left', 0);
                                    $('#noty_bottom_layout_containe').css('margin-right', leftNotfication).css('left', 0);
                                }
                                if (position == 'topRight' || position == 'centerRight' || position == 'bottomRight') {
                                    $('#noty_centerRight_layout_container').css('right', leftNotfication + 20);
                                    $('#noty_topRight_layout_container').css('right', leftNotfication + 20);
                                    $('#noty_bottomRight_layout_container').css('right', leftNotfication + 20);
                                }
                            }
                            else {
                                if (position == 'top' || position == 'bottom') {
                                    $('#noty_top_layout_container').css('margin-left', leftNotfication).css('right', 0);
                                    $('#noty_bottom_layout_container').css('margin-left', leftNotfication).css('right', 0);
                                }
                                if (position == 'topLeft' || position == 'centerLeft' || position == 'bottomLeft') {
                                    $('#noty_centerLeft_layout_container').css('left', leftNotfication + 20);
                                    $('#noty_topLeft_layout_container').css('left', leftNotfication + 20);
                                    $('#noty_bottomLeft_layout_container').css('left', leftNotfication + 20);
                                }
                            }

                        }
                    }
                });

            }
            else {
                var n = $(container).noty({
                    text: content,
                    dismissQueue: true,
                    layout: position,
                    closeWith: ['click'],
                    theme: 'made',
                    maxVisible: 10,
                    buttons: confirm ? [
                        {
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            noty({
                                dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Ok" button', animation: {
                                    open: 'animated bounceIn', close: 'animated bounceOut'
                                }, type: 'success', timeout: 3000
                            });
                        }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                            $noty.close();
                            noty({
                                dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Cancel" button', animation: {
                                    open: 'animated bounceIn', close: 'animated bounceOut'
                                }, type: 'error', timeout: 3000
                            });
                        }
                        }
                    ] : '',
                    animation: {
                        open: openAnimation,
                        close: closeAnimation
                    },
                    timeout: method,
                    callback: {
                        onShow: function () {
                            var sidebarWidth = $('.sidebar').width();
                            var topbarHeight = $('.topbar').height();
                            if (position == 'top' && style == 'topbar') {
                                $('.noty_inline_layout_container').css('top', 0);
                                if ($('body').hasClass('rtl')) {
                                    $('.noty_inline_layout_container').css('right', 0);
                                }
                                else {
                                    $('.noty_inline_layout_container').css('left', 0);
                                }

                            }

                        }
                    }
                });

            }



        }

    }
});


/*
function generate(position, container, content, confirm) {

    console.log(position,container,content,confirm);

    // console.log('position: '+ position + ',container: '+ container + ', style: ' + style);
    if (position == 'bottom') {
        openAnimation = 'animated fadeInUp';
        closeAnimation = 'animated fadeOutDown';
    }
    else if (position == 'top') {
        openAnimation = 'animated fadeIn';
        closeAnimation = 'animated fadeOut';
    }
    else {
        openAnimation = 'animated bounceIn';
        closeAnimation = 'animated bounceOut';
    }

    if (container == '') {

        var n = noty({
            text: content,
            type: type,
            dismissQueue: true,
            layout: position,
            closeWith: ['click'],
            theme: 'made',
            maxVisible: 10,
            animation: {
                open: openAnimation,
                close: closeAnimation,
                easing: 'swing',
                speed: 100
            },
            timeout: method,
            buttons: confirm ? [
                {
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $noty.close();
                    noty({
                        dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Ok" button', animation: {
                            open: 'animated bounceIn', close: 'animated bounceOut'
                        }, type: 'success', timeout: 3000
                    });
                    confirm = false;
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                    noty({
                        dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Cancel" button', animation: {
                            open: 'animated bounceIn', close: 'animated bounceOut'
                        }, type: 'error', timeout: 3000
                    });
                    confirm = false;
                }
                }
            ] : '',
            callback: {
                onShow: function () {
                    leftNotfication = $('.sidebar').width();
                    if ($('body').hasClass('rtl')) {
                        if (position == 'top' || position == 'bottom') {
                            $('#noty_top_layout_container').css('margin-right', leftNotfication).css('left', 0);
                            $('#noty_bottom_layout_containe').css('margin-right', leftNotfication).css('left', 0);
                        }
                        if (position == 'topRight' || position == 'centerRight' || position == 'bottomRight') {
                            $('#noty_centerRight_layout_container').css('right', leftNotfication + 20);
                            $('#noty_topRight_layout_container').css('right', leftNotfication + 20);
                            $('#noty_bottomRight_layout_container').css('right', leftNotfication + 20);
                        }
                    }
                    else {
                        if (position == 'top' || position == 'bottom') {
                            $('#noty_top_layout_container').css('margin-left', leftNotfication).css('right', 0);
                            $('#noty_bottom_layout_container').css('margin-left', leftNotfication).css('right', 0);
                        }
                        if (position == 'topLeft' || position == 'centerLeft' || position == 'bottomLeft') {
                            $('#noty_centerLeft_layout_container').css('left', leftNotfication + 20);
                            $('#noty_topLeft_layout_container').css('left', leftNotfication + 20);
                            $('#noty_bottomLeft_layout_container').css('left', leftNotfication + 20);
                        }
                    }

                }
            }
        });

    }
    else {
        var n = $(container).noty({
            text: content,
            dismissQueue: true,
            layout: position,
            closeWith: ['click'],
            theme: 'made',
            maxVisible: 10,
            buttons: confirm ? [
                {
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $noty.close();
                    noty({
                        dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Ok" button', animation: {
                            open: 'animated bounceIn', close: 'animated bounceOut'
                        }, type: 'success', timeout: 3000
                    });
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                    noty({
                        dismissQueue: true, layout: 'topRight', theme: 'defaultTheme', text: 'You clicked "Cancel" button', animation: {
                            open: 'animated bounceIn', close: 'animated bounceOut'
                        }, type: 'error', timeout: 3000
                    });
                }
                }
            ] : '',
            animation: {
                open: openAnimation,
                close: closeAnimation
            },
            timeout: method,
            callback: {
                onShow: function () {
                    var sidebarWidth = $('.sidebar').width();
                    var topbarHeight = $('.topbar').height();
                    if (position == 'top' && style == 'topbar') {
                        $('.noty_inline_layout_container').css('top', 0);
                        if ($('body').hasClass('rtl')) {
                            $('.noty_inline_layout_container').css('right', 0);
                        }
                        else {
                            $('.noty_inline_layout_container').css('left', 0);
                        }

                    }

                }
            }
        });

    }

}*/
