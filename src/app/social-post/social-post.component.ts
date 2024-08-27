import { Component } from '@angular/core';
import { ElementRef, HostListener, ViewChild } from '@angular/core'; //Clic listeners "blur"
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-social-post',
  templateUrl: './social-post.component.html',
  styleUrls: ['./social-post.component.scss']
})

export class SocialPostComponent {

  constructor(private cdr: ChangeDetectorRef) { }

  profilePic: string = '../../assets/imgs/profile-pic.png';
  isFocused: boolean = false;
  hasContent: boolean = false;
  postContent: string = '';
  isDropdownOpen: boolean = false;
  isDropdown2Open: boolean = false;
  selectedOption: string = 'Público';
  privadoIsVisible: boolean = true;
  soloParaMiIsVisible: boolean = true;
  publicoIsVisible: boolean = false;
  openCreatePostWindow: boolean = false;
  selectedImages: string[] = [];
  publicaciones: { content: string, imageSrc: string[]}[] = [];

  cantidad: number = 0;

  /*--------------------------------------PREPOSTING------------------------------------------ */
  // Maneja el enfoque y desenfoque del textarea
  onFocus() {
    this.isFocused = true;
  }

  // Actualiza el contenido del textarea
  checkContent(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    this.postContent = textArea.value;
    this.hasContent = textArea.value.trim().length > 0;
  }

  // Ajusta el tamaño del textarea según el contenido
  autoResize(event?: Event) {
    const textArea = event?.target as HTMLTextAreaElement;
    if (textArea.value.trim() === '') {
      textArea.style.height = '20px';
    } else {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px'; 
    }
  }

  // Menú privacidad
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('dropdownOpen = ' + this.isDropdownOpen)
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;

    if (option === 'Público') {
      this.privadoIsVisible = true
      this.soloParaMiIsVisible = true
      this.publicoIsVisible = false
    } else if (option === 'Sólo para mí') {
      this.privadoIsVisible = true
      this.soloParaMiIsVisible = false
      this.publicoIsVisible = true
    } else if (option === 'Privado') {
      this.privadoIsVisible = false
      this.soloParaMiIsVisible = true
      this.publicoIsVisible = true
    }
  }

  // Ocultar barra de botones con clic fuera del div
  @ViewChild('contenedorPublicacion') contenedorPublicacion!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    const target = event.target as HTMLElement;

    if (!this.contenedorPublicacion.nativeElement.contains(target) || !target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
    if (!target.closest('.dropdown2')) {
      this.isDropdown2Open = false;
    }
    if (!this.contenedorPublicacion.nativeElement.contains(target)) {
      this.isFocused = false;
    }
  }

  /*--------------------------------------IMAGEN------------------------------------------ */
  // Ventana de Carga de imagenes
  onFileSelected(event: any): void {
    this.openCreatePostWindow = true;
    const files = event.target.files;
    const readPromises: Promise<void>[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      this.cantidad++;
  
      if (this.cantidad < 6) {
        const readPromise = new Promise<void>((resolve, reject) => {
          reader.onload = (e: any) => {
            this.selectedImages.push(e.target.result);
            this.cdr.detectChanges(); // Actualiza la vista si es necesario
            resolve();
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(files[i]);
        });
    
        readPromises.push(readPromise);
      }
    }
  
    // Esperar a que todas las lecturas se completen antes de llamar a addNormalImage
    Promise.all(readPromises).then(() => {

      if (this.cantidad > 5) {
        this.addImageOverlay(5, this.cantidad - 5);
      } else {
        this.addNormalImage(this.cantidad);
      }
    }).catch(error => {
      console.error('Error al leer archivos:', error);
    });
  }

  closeCreatePostWindow () {
    this.selectedImages.length = 0;
    this.openCreatePostWindow = false;
    this.cantidad = 0;
  }
  
  removeImage(): void {
    const overlayDiv = document.getElementsByClassName('overlay')
    const overlay = overlayDiv[0] as HTMLElement;
    this.cantidad--
    if (this.cantidad > 5) {
      overlayDiv[0].textContent = '+' + (this.cantidad - 5).toString()
    } else if (this.cantidad === 5) {
      overlay.style.display = 'none';
    } else if (this.cantidad < 5) {
      this.selectedImages.pop();
      this.addNormalImage(this.cantidad);
      if (this.cantidad === 0) {
        this.closeCreatePostWindow();
      }
    }
    console.log(this.cantidad);
  }

  addNormalImage(cantidad: number, postMedia?: boolean) {
    let imgElements: NodeListOf<HTMLElement> = document.querySelectorAll('.image-thumbnail-item.create-post');

    if (postMedia) {
      this.cdr.detectChanges();
      const postMediaGrid = document.querySelector('.image-thumbnail.post-media');
      console.log(postMediaGrid)
      imgElements = postMediaGrid?.querySelectorAll('img') as NodeListOf<HTMLElement> || [];
      console.log(imgElements);
    }

    for (let i = 0; i < imgElements.length; i++) {
      const img = imgElements[i] as HTMLElement;
      if (cantidad === 1) {
        img.style.gridColumn = 'span 6 / span 6';
        img.style.gridRow = 'span 2 / span 2  ';
      } else if (cantidad === 2) {
        img.style.gridColumn = 'span 3';
        img.style.gridRow = 'span 2';
      } else if (cantidad === 3) {
        if (i === 0) {
          img.style.gridColumn = 'span 6 / span 6';
        } else if (i === 1) {
          img.style.gridColumn = 'span 3 / span 3';
          img.style.gridRowStart = '2';
        } else {
          img.style.gridColumn = 'span 3 / span 3';
          img.style.gridColumnStart = '4'
          img.style.gridRowStart = '2';
        }
      } else if (cantidad === 4) {
        img.style.gridColumn = 'span 3';
        img.style.gridRow = 'span 1';
      } else if (cantidad === 5) {
        if (i < 2) {
          img.style.gridColumn = 'span 3';
          img.style.gridRow = 'span 1';
        } else {
          img.style.gridColumn = 'span 2';
          img.style.gridRow = 'span 1';
        }
      }

    }
  }
  primeraLlamada = true;

  addImageOverlay(maxVisible:number, restantes:number, postMedia?: boolean) {
    let imgElements: NodeListOf<HTMLElement> = document.querySelectorAll('.image-thumbnail-item.create-post');
    let contenedor: HTMLElement | null = document.getElementById('image-thumbnail');

    if (postMedia) {
      this.primeraLlamada = true
      this.cdr.detectChanges();
      const postMediaGrid = document.querySelector('.image-thumbnail.post-media');
      console.log(postMediaGrid)
      imgElements = postMediaGrid?.querySelectorAll('img') as NodeListOf<HTMLElement> || [];
      console.log(imgElements);
      contenedor = document.getElementById('post-media-grid')
    }
    for (let i = 0; i < maxVisible; i++) {
      const img = imgElements[i] as HTMLElement;  

      if (i < 2) {
        img.style.gridColumn = 'span 3';
        img.style.gridRow = 'span 1';
      } else if (i >= 2) {
        img.style.gridColumn = 'span 2';
        img.style.gridRow = 'span 1';
      }

      if (this.primeraLlamada) {
        this.primeraLlamada = false;
        console.log(this.primeraLlamada)
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay');
        if(postMedia) {
          overlayDiv.id = 'overlay-post';
        } else {
          overlayDiv.id = 'overlay';
        }
        overlayDiv.textContent = `+${restantes}`;
        if(contenedor){
          contenedor.appendChild(overlayDiv);
          overlayDiv.style.position = 'absolute';
          overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          overlayDiv.style.color = 'white';
          overlayDiv.style.display = 'flex';
          overlayDiv.style.justifyContent = 'center';
          overlayDiv.style.alignItems = 'center';
          overlayDiv.style.fontSize = '24px';
          overlayDiv.style.top = '155px';
          overlayDiv.style.left = '407px';
          overlayDiv.style.height = '145px';
          overlayDiv.style.width = '194.97px';
          overlayDiv.style.borderRadius = '10px';
        }
      } else if (!this.primeraLlamada) {
        const overlayDiv = document.getElementById('overlay') as HTMLElement;
        overlayDiv.textContent = `+${restantes}`;
      }
    }
  }

  //Menu privacidad ventana create post
  toggleDropdown2(): void {
    this.isDropdown2Open = !this.isDropdown2Open;
    console.log('dropdown2Open = ' + this.isDropdown2Open)
  }
  selectOption2(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;

    if (option === 'Público') {
      this.privadoIsVisible = true
      this.soloParaMiIsVisible = true
      this.publicoIsVisible = false
    } else if (option === 'Sólo para mí') {
      this.privadoIsVisible = true
      this.soloParaMiIsVisible = false
      this.publicoIsVisible = true
    } else if (option === 'Privado') {
      this.privadoIsVisible = false
      this.soloParaMiIsVisible = true
      this.publicoIsVisible = true
    }
  }

  /*-----------------------------------------POSTING------------------------------------------ */
  // Publica el contenido y la imagen
  publicar(): void {
  // Añadir una nueva publicación al inicio de la lista de posts
  this.publicaciones.unshift({
    content: this.postContent,
    imageSrc: this.selectedImages
    });
    //formato Grid
    console.log(this.cantidad)
    if (this.cantidad > 5) {
      this.addImageOverlay(5, this.cantidad - 5, true);
    } else {
      this.addNormalImage(this.selectedImages.length, true);
    }
    // Limpiar después de publicar
    this.postContent = '';
    this.selectedImages = [];
    this.openCreatePostWindow = false;
    this.cantidad = 0;
    this.primeraLlamada = true;
    const textarea = document.getElementById('textarea1') as HTMLTextAreaElement;
    if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
        this.hasContent = false;
        this.isFocused = false;
    }
  }
}