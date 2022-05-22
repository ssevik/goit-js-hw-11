import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { variables } from './js/variables';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchImages from './js/service';
import imageGallery from './js/gallery';


const form = document.querySelector('form');
const input = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

loadMoreBtn.style.display = 'none';

const onGallery = arr => {
  const markup = arr.map(image => imageGallery(image)).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
};

const validate = async () => {
  try {
    const res = await fetchImages(input.value);
    variables.totalPages = Math.ceil(res.totalHits / variables.limit);

    if (res.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (variables.page >= variables.totalPages) {
      loadMoreBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    if (variables.page === 1 && res.hits.length > 0) {
      loadMoreBtn.style.display = 'block';
      Notify.success(`Hoorey! We found ${res.totalHits} images`);
    }

    onGallery(res.hits);
  } catch (err) {
    Notify.failure(err);
  }
};

const searchImages = e => {
  e.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  variables.page = 1;

  validate();
};

const loadMore = () => {
  variables.page += 1;

  validate();
};

form.addEventListener('submit', searchImages);
loadMoreBtn.addEventListener('click', loadMore);
