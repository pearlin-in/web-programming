ocument.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (username && password) {
                // In a real application, you would send this data to a server
                alert(`Login successful!\nWelcome back, ${username}`);
                
                // Reset form
                document.getElementById('login-form').reset();
            } else {
                alert('Please fill in all fields');
            }
        });