import * as $ from 'jquery'
import 'jquery-touchswipe'

window.addEventListener('DOMContentLoaded', () => {

  function gallery({ previewItemsSelector, previewWrapperSelector, prevSelector, nextSelector, navItemClass,
                    navWrapperSelector, createNavSelector, navOverviewSelector, dotActiveSelector, isSwipe = false,
                    arrowActiveSelector, vertical = false, startSlide = 0, }) {

    const previewItems = document.querySelectorAll(previewItemsSelector),
          previewWrapper = document.querySelector(previewWrapperSelector),
          prev = document.querySelector(prevSelector),
          next = document.querySelector(nextSelector),
          navWrapper = document.querySelector(navWrapperSelector),
          navOverview = document.querySelector(navOverviewSelector)

    previewWrapper.style.width = `${100 * previewItems.length}%`
    
    const wrapperWidth = +(window.getComputedStyle(previewWrapper).width.replace('px', '')),
          itemWidth = +(window.getComputedStyle(previewItems[0]).width.replace('px', ''))
    
    let offset = itemWidth * startSlide
    let curItem = startSlide

    previewWrapper.style.transform = `translateX(-${offset}px)`
    
    function createNavs() {
      previewItems.forEach(item => {
        const navItem = document.createElement('div'),
              img = document.createElement('img')
        
        navItem.classList.add(navItemClass)
        img.src = item.children[0].src

        navItem.append(img)
        navWrapper.append(navItem)
      })
    }

    createNavs()

    function makePreviewSlider() {
      
      next.addEventListener('click', () => {
        offset+= itemWidth
        curItem++

        if(offset > wrapperWidth - itemWidth) {
          offset = wrapperWidth - itemWidth
          curItem = previewItems.length - 1
        }

        previewWrapper.style.transform = `translateX(-${offset}px)`

        removeActiveDots()
        addActiveDot()
        blockArrow()
      })

      prev.addEventListener('click', () => {
        offset-= itemWidth
        curItem--

        if(offset < 0) {
          offset = 0
          curItem = 0
        }

        previewWrapper.style.transform = `translateX(${-offset}px)`
        
        removeActiveDots()
        addActiveDot()
        blockArrow()
      })
    }

    makePreviewSlider()

    function addActiveDot() {
      document.querySelectorAll(createNavSelector).forEach((item, i) => {
        if(i === curItem) {
          item.classList.add(dotActiveSelector)
        }
      })
    }

    function removeActiveDots() {
      document.querySelectorAll(createNavSelector).forEach((item, i) => {
        item.classList.remove(dotActiveSelector)
      })
    }

    removeActiveDots()
    addActiveDot()

    function clickDots() {
      const navItems = document.querySelectorAll(createNavSelector)

      navItems.forEach((item, i) => {
        item.addEventListener('click', () => {
          offset= itemWidth * i
          curItem = i

          previewWrapper.style.transform = `translateX(-${offset}px)`

          removeActiveDots()
          addActiveDot()
          blockArrow()
        })
      })
    }

    clickDots()

    function blockArrow() {
      if(Math.round(offset) === 0)  {
        prev.classList.add(arrowActiveSelector)
      } else {
        prev.classList.remove(arrowActiveSelector)
      }

      if(Math.round(offset) === Math.round(wrapperWidth - itemWidth)) {
        next.classList.add(arrowActiveSelector)
      } else {
        next.classList.remove(arrowActiveSelector)
      }
    }

    blockArrow()

    function moveNavContainer() {
      let navWrapperDerived = +(window.getComputedStyle(navWrapper).width.replace('px', '')),
          navOverviewDerived = +(window.getComputedStyle(navOverview).width.replace('px', '')),
          navHidden = navWrapperDerived - navOverviewDerived,
          navItems = document.querySelectorAll(createNavSelector),
          navItemDerived = +(window.getComputedStyle(navItems[0]).width.replace('px', '')),
          offsetNav = navItemDerived * startSlide,
          axis = 'X'

      if(vertical) {
          navWrapperDerived = +(window.getComputedStyle(navWrapper).height.replace('px', '')),
          navOverviewDerived = +(window.getComputedStyle(navOverview).height.replace('px', '')),
          navHidden = navWrapperDerived - navOverviewDerived,
          navItems = document.querySelectorAll(createNavSelector),
          navItemDerived = +(window.getComputedStyle(navItems[0]).height.replace('px', '')),
          axis = 'Y'
      }
      
      if(offsetNav <= navHidden) {
        navWrapper.style.transform = `translate${axis}(-${offsetNav}px)`
      } else {
        navWrapper.style.transform = `translate${axis}(-${navHidden}px)`
      }

      next.addEventListener('click', () => {
        offsetNav+= navItemDerived

        if(offsetNav <= navHidden) {
          navWrapper.style.transform = `translate${axis}(-${offsetNav}px)`
        } else {
          navWrapper.style.transform = `translate${axis}(-${navHidden}px)`
        }
      })

      prev.addEventListener('click', () => {
        offsetNav-= navItemDerived

        if(offsetNav <= navHidden) {
          navWrapper.style.transform = `translate${axis}(${-offsetNav}px)`
        }
      })

      navItems.forEach((item, i) => {
        item.addEventListener('click', () => {
          offsetNav = navItemDerived * i

          if(offsetNav <= navHidden) {
            navWrapper.style.transform = `translate${axis}(-${offsetNav}px)`
          } else {
            navWrapper.style.transform = `translate${axis}(-${navHidden}px)`
          }
        })
      })
    }

    moveNavContainer()

    function swipe() {
      $(function() {
        $(previewWrapperSelector).swipe( {
          swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

            if(direction === "left" && offset < (wrapperWidth - itemWidth)) {
              console.log(offset)
              next.click()
            } 
            
            if(direction === "right" && offset > 0) {
              prev.click()
              console.log(offset)
            }
          }
        });
      });
    }

    if(isSwipe) {
      swipe()
    }

    
  }

  function galleryModal({ modalSelector, previewSelector, navSelector, svgArrow, modalArrowClass }) {
    const modal = document.querySelector(modalSelector)

    function galleryModalCreate(showSlideNumber) {
      const preview = document.querySelector(previewSelector),
            nav = document.querySelector(navSelector)
  
      while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
      }
  
      modal.append(preview.cloneNode(true))
      modal.append(nav.cloneNode(true))
  
      const navItems = document.querySelectorAll(`${modalSelector} ${settings.gallery.createNavSelector}`)
  
      navItems.forEach(item => {
        item.remove()
      })

      function createModalArrows() {
        const arrowLeft = document.createElement('div')
        arrowLeft.classList.add(modalArrowClass)
        arrowLeft.setAttribute('id', settings.modal.prevSelector.replace('#', ''))
        arrowLeft.innerHTML = svgArrow
    
        const arrowRight = document.createElement('div')
        arrowRight.classList.add(modalArrowClass)
        arrowRight.setAttribute('id', settings.modal.nextSelector.replace('#', ''))
        arrowRight.innerHTML = svgArrow
    
        document.querySelector(`${modalSelector} ${previewSelector}`).append(arrowLeft)
        document.querySelector(`${modalSelector} ${previewSelector}`).append(arrowRight)
      }
  
      createModalArrows()
  
      gallery({
        previewItemsSelector: `${modalSelector} ${settings.gallery.previewItemsSelector}`,
        previewWrapperSelector: `${modalSelector} ${settings.gallery.previewWrapperSelector}`,
        prevSelector: `${modalSelector} ${settings.modal.prevSelector}`,
        nextSelector: `${modalSelector} ${settings.modal.nextSelector}`,
        navItemClass: settings.gallery.navItemClass,
        navWrapperSelector: `${modalSelector} ${settings.gallery.navWrapperSelector}`,
        createNavSelector: `${modalSelector} ${settings.gallery.createNavSelector}`,
        navOverviewSelector: `${modalSelector} ${settings.gallery.navOverviewSelector}`,
        vertical: settings.modal.vertical,
        startSlide: showSlideNumber,
        dotActiveSelector: settings.gallery.dotActiveSelector,
        arrowActiveSelector: settings.gallery.arrowActiveSelector,
        isSwipe: settings.modal.isSwipe
      })

      generateCloseBtn()
    }
  
    function showGalleryModal() {
      document.querySelectorAll(settings.gallery.previewItemsSelector).forEach((item, i) => {
        item.addEventListener('click', () => {
          galleryModalCreate(i)

          modal.style.visibility = 'visible'
          modal.style.opacity = '1'
        })
      })
    }
  
    showGalleryModal()
  
    function generateCloseBtn() {
      const close = document.createElement('div')
      close.classList.add('close')
      close.innerHTML = '&times;'

      modal.append(close)

      close.addEventListener('click', () => {
        modal.style.visibility = 'hidden'
        modal.style.opacity = '0'
      })
    }
  }

  const settings = {
    gallery: {
      previewItemsSelector: '.gallery-preview__item',                
      previewWrapperSelector: '.gallery-preview__inner',           
      prevSelector: '#arrow-left',                                  
      nextSelector: '#arrow-right',                                 
      navItemClass: 'gallery-nav__slider-item',               
      navWrapperSelector: '.gallery-nav__slider-inner',     
      createNavSelector: '.gallery-nav__slider-item',         
      navOverviewSelector: '.gallery-nav__slider',
      vertical: false,                                              
      startSlide: 0,                                                
      dotActiveSelector: 'active-dot',                          
      arrowActiveSelector: 'disable-arrow',
      isSwipe: true,
    },
    modal: {
      modalSelector: '.galleryModal',                       
      previewSelector: '.gallery-preview',              
      navSelector: '.gallery-nav',         
      prevSelector: '#preview-left',                                  
      nextSelector: '#preview-right',
      modalArrowClass: 'gallery-preview__arrow',
      vertical: true,
      isSwipe: false,
      svgArrow: `
        <svg id="arrow" viewBox="0 0 443.52 443.52">
          <path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8
            c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712
            L143.492,221.863z"/>
        </svg>
      `
    }
  }

  gallery({
    previewItemsSelector: settings.gallery.previewItemsSelector, // necessarily
    previewWrapperSelector: settings.gallery.previewWrapperSelector, // necessarily
    prevSelector: settings.gallery.prevSelector, // necessarily
    nextSelector: settings.gallery.nextSelector, // necessarily
    navItemClass: settings.gallery.navItemClass, // necessarily
    navWrapperSelector: settings.gallery.navWrapperSelector, // necessarily
    createNavSelector: settings.gallery.createNavSelector, // necessarily
    navOverviewSelector: settings.gallery.navOverviewSelector, // necessarily
    vertical: settings.gallery.vertical, // not necessarily
    startSlide: settings.gallery.startSlide, // not necessarily
    dotActiveSelector: settings.gallery.dotActiveSelector, // necessarily
    arrowActiveSelector: settings.gallery.arrowActiveSelector, // necessarily
    isSwipe: settings.gallery.isSwipe
  })

  galleryModal({
    modalSelector: settings.modal.modalSelector,  // necessarily
    previewSelector: settings.modal.previewSelector,  // necessarily
    navSelector: settings.modal.navSelector,  // necessarily
    svgArrow: settings.modal.svgArrow,
    modalArrowClass: settings.modal.modalArrowClass
  })
})