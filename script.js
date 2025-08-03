// Local Storage Functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Initialize default clubs if none exist
function initializeDefaultClubs() {
    let clubs = getFromLocalStorage('allClubs');
    if (!clubs || clubs.length === 0) {
        const defaultClubs = [
            {
                id: 'default-1',
                name: 'Classic Literature Society',
                description: 'A club dedicated to reading and discussing timeless literary masterpieces from around the world.',
                purpose: 'To explore the greatest works of literature and their lasting impact on culture and society.',
                genre: 'fiction',
                coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
                members: 127,
                books: [
                    { title: 'Pride and Prejudice', author: 'Jane Austen', url: '#' },
                    { title: '1984', author: 'George Orwell', url: '#' }
                ]
            },
            {
                id: 'default-2',
                name: 'Mystery & Thriller Club',
                description: 'For those who love suspenseful stories, plot twists, and keeping readers on the edge of their seats.',
                purpose: 'To dive deep into mystery novels and discuss plot devices, character development, and storytelling techniques.',
                genre: 'mystery',
                coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                members: 89,
                books: [
                    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', url: '#' },
                    { title: 'Gone Girl', author: 'Gillian Flynn', url: '#' }
                ]
            },
            {
                id: 'default-3',
                name: 'Science Fiction Explorer',
                description: 'Exploring futuristic worlds, advanced technologies, and the possibilities of tomorrow.',
                purpose: 'To examine how science fiction reflects current issues and predicts future developments.',
                genre: 'sci-fi',
                coverImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
                members: 156,
                books: [
                    { title: 'Dune', author: 'Frank Herbert', url: '#' },
                    { title: 'The Martian', author: 'Andy Weir', url: '#' }
                ]
            }
        ];
        saveToLocalStorage('allClubs', defaultClubs);
    }
}

// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Generate unique ID
function generateId() {
    return 'club-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Image preview function
function setupImagePreview() {
    const imageInput = document.getElementById('coverImage');
    const preview = document.getElementById('imagePreview');
    
    if (imageInput && preview) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Cover Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = '';
            }
        });
    }
}

// Create club card HTML
function createClubCard(club, showJoinButton = true) {
    const isJoined = isClubJoined(club.id);
    const joinButtonText = isJoined ? 'View Club' : 'Join Club';
    const joinButtonClass = isJoined ? 'btn-secondary' : 'btn-primary';
    
    return `
        <div class="club-card">
            <img src="${club.coverImage || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'}" alt="${club.name}" class="club-cover">
            <div class="club-card-content">
                <h3>${club.name}</h3>
                <p>${club.description}</p>
                ${showJoinButton ? `<button class="btn ${joinButtonClass}" onclick="handleJoinClub('${club.id}')">${joinButtonText}</button>` : ''}
            </div>
        </div>
    `;
}

// Check if club is joined
function isClubJoined(clubId) {
    const joinedClubs = getFromLocalStorage('joinedClubs') || [];
    return joinedClubs.includes(clubId);
}

// Handle joining a club
function handleJoinClub(clubId) {
    const clubs = getFromLocalStorage('allClubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    if (isClubJoined(clubId)) {
        // Navigate to club page
        window.location.href = `club_page.html?id=${clubId}`;
    } else {
        // Join the club
        let joinedClubs = getFromLocalStorage('joinedClubs') || [];
        joinedClubs.push(clubId);
        saveToLocalStorage('joinedClubs', joinedClubs);
        
        showToast(`You have joined "${club.name}"!`);
        
        // Refresh the page to update button states
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Page-specific functions
function initializeStartClubPage() {
    setupImagePreview();
    
    const form = document.getElementById('startClubForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const imageFile = formData.get('coverImage');
            
            const newClub = {
                id: generateId(),
                name: formData.get('clubName'),
                description: formData.get('description'),
                purpose: formData.get('purpose'),
                genre: formData.get('genre'),
                coverImage: imageFile ? URL.createObjectURL(imageFile) : '',
                members: 1,
                books: []
            };
            
            // Save to created clubs
            let createdClubs = getFromLocalStorage('createdClubs') || [];
            createdClubs.push(newClub.id);
            saveToLocalStorage('createdClubs', createdClubs);
            
            // Save to all clubs
            let allClubs = getFromLocalStorage('allClubs') || [];
            allClubs.push(newClub);
            saveToLocalStorage('allClubs', allClubs);
            
            showToast('Club created successfully!');
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        });
    }
}

function initializeJoinClubPage() {
    const clubsGrid = document.getElementById('clubsGrid');
    if (clubsGrid) {
        const clubs = getFromLocalStorage('allClubs') || [];
        
        if (clubs.length === 0) {
            clubsGrid.innerHTML = '<p>No clubs available. <a href="start_club.html">Start the first one!</a></p>';
        } else {
            clubsGrid.innerHTML = clubs.map(club => createClubCard(club)).join('');
        }
    }
}

function initializeProfilePage() {
    const createdClubsGrid = document.getElementById('createdClubs');
    const joinedClubsGrid = document.getElementById('joinedClubs');
    
    if (createdClubsGrid) {
        const createdClubIds = getFromLocalStorage('createdClubs') || [];
        const allClubs = getFromLocalStorage('allClubs') || [];
        const createdClubs = allClubs.filter(club => createdClubIds.includes(club.id));
        
        if (createdClubs.length === 0) {
            createdClubsGrid.innerHTML = '<p>You haven\'t created any clubs yet. <a href="start_club.html">Start one now!</a></p>';
        } else {
            createdClubsGrid.innerHTML = createdClubs.map(club => createClubCard(club, false)).join('');
        }
    }
    
    if (joinedClubsGrid) {
        const joinedClubIds = getFromLocalStorage('joinedClubs') || [];
        const allClubs = getFromLocalStorage('allClubs') || [];
        const joinedClubs = allClubs.filter(club => joinedClubIds.includes(club.id));
        
        if (joinedClubs.length === 0) {
            joinedClubsGrid.innerHTML = '<p>You haven\'t joined any clubs yet. <a href="join_club.html">Browse available clubs!</a></p>';
        } else {
            joinedClubsGrid.innerHTML = joinedClubs.map(club => createClubCard(club, false)).join('');
        }
    }
}

function initializeClubPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get('id');
    
    if (!clubId) {
        document.body.innerHTML = '<div class="container"><h1>Club not found</h1><a href="join_club.html">Back to clubs</a></div>';
        return;
    }
    
    const clubs = getFromLocalStorage('allClubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
        document.body.innerHTML = '<div class="container"><h1>Club not found</h1><a href="join_club.html">Back to clubs</a></div>';
        return;
    }
    
    // Populate club details
    document.getElementById('clubCover').src = club.coverImage || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
    document.getElementById('clubTitle').textContent = club.name;
    document.getElementById('clubDescription').textContent = club.description;
    document.getElementById('clubGenre').textContent = club.genre || 'General';
    document.getElementById('memberCount').textContent = `${club.members} members`;
    document.getElementById('clubPurpose').textContent = club.purpose || '';
    
    // Populate books
    const booksGrid = document.getElementById('booksGrid');
    if (club.books && club.books.length > 0) {
        booksGrid.innerHTML = club.books.map(book => `
            <div class="book-card">
                <h4>${book.title}</h4>
                <p>by ${book.author}</p>
                <button class="btn btn-primary" onclick="window.open('${book.url}', '_blank')">Download PDF</button>
            </div>
        `).join('');
    } else {
        booksGrid.innerHTML = '<p>No books uploaded yet.</p>';
    }
    
    // Setup upload modal
    const uploadBtn = document.getElementById('uploadBookBtn');
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadBookForm');
    
    uploadBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const fileInput = document.getElementById('bookFile');
        
        if (fileInput.files.length > 0) {
            const newBook = {
                title: title,
                author: author || 'Unknown Author',
                url: '#' // In a real app, this would be the uploaded file URL
            };
            
            // Update club with new book
            club.books = club.books || [];
            club.books.push(newBook);
            
            // Save updated clubs
            const updatedClubs = clubs.map(c => c.id === clubId ? club : c);
            saveToLocalStorage('allClubs', updatedClubs);
            
            showToast('Book uploaded successfully!');
            modal.style.display = 'none';
            uploadForm.reset();
            
            // Refresh books grid
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultClubs();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'start_club.html':
            initializeStartClubPage();
            break;
        case 'join_club.html':
            initializeJoinClubPage();
            break;
        case 'profile.html':
            initializeProfilePage();
            break;
        case 'club_page.html':
            initializeClubPage();
            break;
        default:
            // Home page or other pages
            break;
    }
});