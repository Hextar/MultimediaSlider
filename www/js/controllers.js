angular.module('angular-multimediaslider')

    .controller('Home', function ($scope) {

        $scope.items = [
            {
                src: 'http://placehold.it/800x900',
                sub: 'This is <b>SAMPLE 1</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                uid : '111',
                video: 'CjgnyPGAgp8',
                sub: 'This is <b>SAMPLE 2</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                video: 'rwTZKRA4mys',
                sub: 'This is <b>SAMPLE 3</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                uid : '222',
                src: 'http://placehold.it/300x200',
                sub: 'This is <b>SAMPLE 4</b>',
                thumb: 'http://placehold.it/100x100'
            },
            {
                uid : '333',
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
