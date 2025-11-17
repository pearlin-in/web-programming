document.getElementById('signup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (username && email && password) {
                // In a real application, you would send this data to a server
                alert(`Account created successfully!\nUsername: ${username}\nEmail: ${email}`);
                
                // Reset form
                document.getElementById('signup-form').reset();
            } else {
                alert('Please fill in all fields');
            }
        });