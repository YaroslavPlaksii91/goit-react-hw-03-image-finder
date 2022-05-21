import { Component } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import { fetchImagesAPI } from 'services/images-api';
import Loader from 'react-js-loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    currentPage: 1,
    error: null,
    isLoading: false,
    selectedImage: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
  }

  onFormSubmit = query => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      images: [],
      error: null,
    });
  };

  fetchImages = async () => {
    try {
      const { currentPage, searchQuery } = this.state;

      this.setState({ isLoading: true });

      const images = await fetchImagesAPI(searchQuery, currentPage);
      this.setState(prevState => ({
        images: [...prevState.images, ...images],
        currentPage: prevState.currentPage + 1,
      }));

      if (images.length === 0) return toast.warn('Sorry, no such images.');
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  toggleModal = (src = '') => this.setState({ selectedImage: src });

  render() {
    const { images, isLoading, error, selectedImage } = this.state;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
        }}
      >
        {error && <p>{error.message}</p>}

        <Searchbar onSubmit={this.onFormSubmit} />
        <ImageGallery images={images} showModal={this.toggleModal} />
        {isLoading && <Loader type="bubble-loop" size={60} bgColor="blue" />}
        {images.length > 0 && !isLoading && (
          <Button onClick={this.fetchImages}>Load more</Button>
        )}

        {selectedImage && (
          <Modal onClose={this.toggleModal} src={selectedImage} />
        )}
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}

export default App;
