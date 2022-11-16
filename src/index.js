import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchPhoto from "./fetchPhoto";

Notify.init({
  distance: '20px',
  cssAnimationStyle: 'from-top',
  fontSize: '16px',
  // useFontAwesome: true,
  timeout: 2000,
  backOverlay: true,
  // plainText: false,
  clickToClose: true,
});

let pageNumber;
let requstedValue;
let reqiuiredPhotoQty = 40;


const refs = {
    form: document.querySelector('.search-form'),
    galleryBox: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    endlist: document.querySelector('.endlist'),
}

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
    event.preventDefault();
    refs.galleryBox.innerHTML = '';
    pageNumber = 1;
    // refs.endlist.classList.add('visually-hidden');
    addVisuallyHidden(refs.endlist);
    requstedValue = event.target.elements.searchQuery.value.trim();

    console.log(requstedValue);

    if (requstedValue === '') {
        Notify.failure('Error, please fill the request')
        return
    }

    removeVisuallyHidden(refs.galleryBox)

    try {
        const response = await fetchPhoto(requstedValue, pageNumber);
        pageNumber += 1
        const photos = await response.data.hits;

        if (photos.length === 0) {
             return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }

        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

        addGalleryMarkup(photos)
        // infiniteScrollObserver.observe(refs.galleryBox)

        if (reqiuiredPhotoQty > response.data.hits.length) {
            removeVisuallyHidden(refs.endlist)
        }

        if (reqiuiredPhotoQty > response.data.totalHits) {
            Notify.warning(`Attention, there are only ${response.data.totalHits} matching your search query. Please try again.`);
            // showGallery(refs.endlist)
        }
        console.log(photos);
        
    } catch (error) {
        return notifyFailure(error);
    }
}

function addGalleryMarkup(dataArray) {
    const galleryMarkup = dataArray
        .map(
            ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) => {
        return`<div class="photo-card">
      <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
  </a>
</div>`
}).join('')

// console.log(galleryMarkup);

    refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup);
    // startInfiniteObserver()
    lightbox.refresh()
};

async function onLoadMore(event) {
    try {
        const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
        const response = await fetchPhoto(requstedValue, pageNumber);
        pageNumber += 1
        const photos = await response.data.hits;

        addGalleryMarkup(photos);

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        if (reqiuiredPhotoQty > photos.length) {
            Notify.failure("Sorry, there are no more images matching your search query. Please try another request.");
            removeVisuallyHidden(refs.endlist)
        }
        console.log(photos);
        
    } catch (error) {
        return notifyFailure(error);
    }
}

function removeVisuallyHidden(ref) {
    ref.classList.remove('visually-hidden');
};

function addVisuallyHidden(ref) {
    ref.classList.add('visually-hidden');
}

function notifyFailure(error) {
  Notify.failure(`Houston, we have a problem - ${error}`);
}

// simpleLightbox gallery

refs.galleryBox.addEventListener('click', onOpenImage)

function onOpenImage(event) {
    event.preventDefault();

    if (event.target.nodeName !== 'IMG') {
        return
    }
};

var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.9,
    showCounter: false,
    disableRightClick: true,
    disableScroll: true,
});

window.addEventListener('scroll', () => {
    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //     // console.log('you are on the bottom');
    // }
    // const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    // console.log(scrollHeight - clientHeight);
    // console.log(scrollTop);
    // console.log(clientHeight);

    // if (scrollTop === scrollHeight - clientHeight) {
    //     console.log('last image');
    //     await onLoadMore();
    // }

    // console.log(window.innerHeight + window.scrollY);
    // console.log(document.body.offsetHeight);
    // console.log(clientHeight);

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log('last image');
        onLoadMore();
    }
})

// Intersection observer

// let infiniteScrollObserver = new IntersectionObserver((entries, infiniteScrollObserver) => {

//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             console.log('last image');

//             onLoadMore()
//         }
//         infiniteScrollObserver.unobserve(entry.target)
//         infiniteScrollObserver.observe(refs.galleryBox.lastElementChild)
//     })
// }, {
//     threshold: 0.1
// })

// function startInfiniteObserver() {
//     let infiniteScrollObserver = new IntersectionObserver(onScrollIntersection, { threshold: 0.1 });
//     const lastLoadedImage = refs.galleryBox.lastElementChild;

//     infiniteScrollObserver.observe(lastLoadedImage);
//   }

// function onScrollIntersection(entries, infiniteScrollObserver) {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         infiniteScrollObserver.unobserve(entry.target);
//         console.log('last image');
//         onLoadMore()
//       }
//     });
//   }
