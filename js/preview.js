'use strict';

(function () {
  var MIN_VALUE_SCALE = 25;
  var MAX_VALUE_SCALE = 100;
  var STEP_SCALE = 25;
  var FILTER_DATA = {
    none: {
      name: '',
      minValue: 0,
      maxValue: 0,
      dimension: ''
    },
    chrome: {
      name: 'grayscale',
      minValue: 0,
      maxValue: 1,
      dimension: ''
    },
    sepia: {
      name: 'sepia',
      minValue: 0,
      maxValue: 1,
      dimension: ''
    },
    marvin: {
      name: 'invert',
      minValue: 0,
      maxValue: 100,
      dimension: '%'
    },
    phobos: {
      name: 'blur',
      minValue: 0,
      maxValue: 3,
      dimension: 'px'
    },
    heat: {
      name: 'brightness',
      minValue: 1,
      maxValue: 3,
      dimension: ''
    }
  };

  var imgPreviewContainer = document.querySelector('.img-upload');
  var imgPreview = imgPreviewContainer.querySelector('.img-upload__preview img');
  var btnZoomOut = imgPreviewContainer.querySelector('.scale__control--smaller');
  var btnZoomOn = imgPreviewContainer.querySelector('.scale__control--bigger');
  var valueScaleControl = imgPreviewContainer.querySelector('.scale__control--value');
  var imageEffectSwitches = imgPreviewContainer.querySelectorAll('.effects__radio');
  var sliderLevelEffect = imgPreviewContainer.querySelector('.img-upload__effect-level');
  var pinLevelEffect = imgPreviewContainer.querySelector('.effect-level__pin');
  var depthLevelEffect = imgPreviewContainer.querySelector('.effect-level__depth');
  var currentEffectName = 'none';
  var currentFilter = FILTER_DATA[currentEffectName];

  function addHandlerResize() {
    btnZoomOut.addEventListener('click', function () {
      resizeImage(-1);
    });

    btnZoomOn.addEventListener('click', function () {
      resizeImage(1);
    });
  }

  function resizeImage(direction) {
    var size = parseInt(valueScaleControl.value, 10) + STEP_SCALE * direction;
    if (size > MAX_VALUE_SCALE) {
      size = MAX_VALUE_SCALE;
    } else if (size < MIN_VALUE_SCALE) {
      size = MIN_VALUE_SCALE;
    }
    valueScaleControl.value = size + '%';
    imgPreview.style.transform = 'scale(' + (size / 100) + ')';
  }

  function changeEffect(item) {
    var effectName = item.value;
    imgPreview.classList.remove('effects__preview--' + currentEffectName);
    imgPreview.classList.add('effects__preview--' + effectName);
    sliderLevelEffect.classList.toggle('hidden', imgPreview.classList.contains('effects__preview--none'));
    currentEffectName = effectName;

    currentFilter = FILTER_DATA[effectName];
    changeLevelEffects(1, currentFilter);
  }

  function addMouseEventListener() {
    var container = document.querySelector('.img-upload__effect-level');
    var pinContainer = container.querySelector('.effect-level__line');

    pinLevelEffect.addEventListener('mousedown', function (evt) {
      var posCenterOfPin = pinLevelEffect.getBoundingClientRect().left + pinLevelEffect.getBoundingClientRect().width / 2;
      var shift = evt.clientX - posCenterOfPin;
      var posPinContainer = pinContainer.getBoundingClientRect().left;
      var widthPinContainer = pinContainer.getBoundingClientRect().width;

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();
        var posPinInPercent = (moveEvt.clientX - shift - posPinContainer) / widthPinContainer;

        if (posPinInPercent >= 1) {
          posPinInPercent = 1;
        } else if (posPinInPercent <= 0) {
          posPinInPercent = 0;
        }

        changeLevelEffects(posPinInPercent, currentFilter);
      }

      function onMouseUp(upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    changeLevelEffects(1, '');
  }

  function changeLevelEffects(ratio, filter) {
    var filterRatio = ratio * (filter.maxValue - filter.minValue) + filter.minValue;

    pinLevelEffect.style.left = ratio * 100 + '%';
    depthLevelEffect.style.width = ratio * 100 + '%';
    imgPreview.style.filter = (filter.name) ? filter.name + '(' + filterRatio + filter.dimension + ')' : '';
  }

  function resetPhotoChanges() {
    imgPreview.style = '';
    imgPreview.classList.remove('effects__preview--' + currentEffectName);
    currentEffectName = 'none';
    currentFilter = FILTER_DATA[currentEffectName];
  }

  function addHandlerChangeEffect() {
    changeEffect(imageEffectSwitches[0]);
    imageEffectSwitches.forEach(function (item) {
      item.addEventListener('click', function () {
        changeEffect(item);
      });
    });
  }

  addHandlerResize();
  addMouseEventListener();

  window.resetPhotoChanges = resetPhotoChanges;
  window.addHandlerChangeEffect = addHandlerChangeEffect;
})();

