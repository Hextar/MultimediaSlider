angular.module('angular-multimediaslider')

    .controller('Home', function ($scope) {

        $scope.items = [
            {
                src: 'http://placehold.it/800x900',
                sub: 'This is <b>SAMPLE 1</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                video: 'CjgnyPGAgp8',
                sub: 'This is <b>SAMPLE 2</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                video: '_JS_RFCQZtc',
                sub: 'This is <b>SAMPLE 3</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                src: 'http://placehold.it/300x200',
                sub: 'This is <b>SAMPLE 4</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                video: 'u36IGHpWUgg',
                sub: 'This is a <b>SAMPLE 5</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                src: 'http://placehold.it/400x400',
                sub: 'This is <b>SAMPLE 6</b>',
                thumb: 'http://placehold.it/100x100'
            }
        ];

    });
