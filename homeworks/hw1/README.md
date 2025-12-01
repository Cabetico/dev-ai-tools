# Introduction to AI-Assisted Development
In this homework, we'll build an application with AI.

You can use any tool you want: ChatGPT, Claude, GitHub Copilot, Codex, Cursor, Antigravity, etc.

With chat-based applications you will need to copy code back-and-forth, so we recommend that you use an AI assistant in your IDE with agent mode.

We will build a TODO application in Django.

The app should be able to do the following:

* Create, edit and delete TODOs
* Assign due dates
* Mark TODOs as resolved
You will only need Python to get started (we also recommend that you use uv).

You don't need to know Python or Django for doing this homework.

## Question 1: Install Django
We want to install Django. Ask AI to help you with that.

What's the command you used for that?

There could be multiple ways to do it. Put the one that AI suggested in the homework form.

### Initialize a new Python project with uv
 ```bash uv init myproject
    cd myproject
 ```

 if you already cd'd into the folder
 ```bash 
    uv init .
 ```

### Add Django as a dependency (uv will create pyproject.toml and uv.lock)
```bash 
uv add django
```

### Create a virtual environment and install dependencies

```bash
uv sync
``` 

### Activate the virtual environment

```bash
source .venv/bin/activate
```

### Start your Django project
```bash
uv run django-admin startproject config .
```

### Add other packages you might need
* `uv add psycopg2-binary`   PostgreSQL
* `uv add pillow`            Image handling
* `uv add django-environ`    Environment variables
* `uv add djangorestframework`   REST API

# Or add dev dependencies
* `uv add --dev pytest pytest-django black ruff` 

## Question 2: Project and App

Now we need to create a project and an app for that.

Follow the instructions from AI to do it. At some point, you will need to include the app you created in the project.

What's the file you need to edit for that?

* `settings.py` 
* `manage.py` this one
* `urls.py` 
* `wsgi.py` 

### 1. Create the Django Project

#### Create the main project (called 'config' or 'todo_project')
`uv run django-admin startproject config .`

The `.` at the end creates it in the current directory
 Your structure will look like:

```bash
.
 ├── config/
 │   ├── __init__.py
 │   ├── settings.py
 │   ├── urls.py
 │   ├── asgi.py
 │   └── wsgi.py
 ├── manage.py
 ├── pyproject.toml
 └── uv.lock
```

#### 2. Create the TODO App
`uv run python manage.py startapp todos`

```bash
todos/
 ├── __init__.py
 ├── admin.py
 ├── apps.py
 ├── models.py
 ├── tests.py
 ├── views.py
 └── migrations/
```

## Question 3: Django Models
Let's now proceed to creating models - the mapping from python objects to a relational database.

For the TODO app, which models do we need? Implement them.

What's the next step you need to take?

* Run the application 4)
* Add the models to the admin panel 2)
* Run migrations 1) answer
* Create a makefile ?

### 3. Register the App
Edit config/settings.py and add your app to INSTALLED_APPS:

```bash
    INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'todos',  # Add this line
]
```

### 4. Create Your TODO Model
Edit `todos/models.py`:

```bash
    from django.db import models
    from django.contrib.auth.models import User

    class Todo(models.Model):
        title = models.CharField(max_length=200)
        description = models.TextField(blank=True)
        completed = models.BooleanField(default=False)
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)
        user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
        
        class Meta:
            ordering = ['-created_at']
        
        def __str__(self):
            return self.title
```
### 5. Create and Run Migrations

```bash
    # Create migration files
    uv run python manage.py makemigrations

    # Apply migrations to database
    uv run python manage.py migrate
```

### 6. Register Model in Admin

Edit `todos/admin.py`:

```bash
    from django.contrib import admin
    from .models import Todo

    @admin.register(Todo)
    class TodoAdmin(admin.ModelAdmin):
    list_display = ['title', 'completed', 'user', 'created_at']
    list_filter = ['completed', 'created_at']
    search_fields = ['title', 'description']
```

### 7. Create a Superuser

```bash
    uv run python manage.py createsuperuser
    # Follow the prompts to set username, email, and password
```

## Question 4. TODO Logic
Let's now ask AI to implement the logic for the TODO app. Where do we put it?

* `views.py` answer
* `urls.py`
* `admin.py`
* `tests.py`

### 1. Create Views (The Logic)
Edit `todos/views.py`:

### 2. Create a Form
Create `todos/forms.py`:

```bash
    from django import forms
    from .models import Todo

    class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = ['title', 'description', 'completed']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter todo title'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Enter description (optional)'}),
            'completed': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
```

### 3. Create URLs
Create `todos/urls.py`:

```bash
    from django.urls import path
    from . import views

    urlpatterns = [
        path('', views.todo_list, name='todo_list'),
        path('create/', views.todo_create, name='todo_create'),
        path('<int:pk>/update/', views.todo_update, name='todo_update'),
        path('<int:pk>/delete/', views.todo_delete, name='todo_delete'),
        path('<int:pk>/toggle/', views.todo_toggle, name='todo_toggle'),
    ]
```

### 4. Include URLs in Main Project

Edit `config/urls.py`:

```bash

    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('todos/', include('todos.urls')),
        path('accounts/', include('django.contrib.auth.urls')), ]  # For login/logout
```

## Question 5. Templates
Next step is creating the templates. You will need at least two: the base one and the home one. Let's call them `base.html` and `home.html`.

Where do you need to register the directory with the templates?

`INSTALLED_APPS` in project's `settings.py`
`TEMPLATES['DIRS']` in project's `settings.py`
`TEMPLATES['APP_DIRS']` in project's `settings.py`
In the app's `urls.py`

### 5. 5. Create Templates
Create the directory structure:

`mkdir -p todos/templates/todos`
`mkdir -p todos/templates/registration`

* `todos/templates/todos/base.html`:

* `todos/templates/todos/todo_list.html`:

* `todos/templates/todos/todo_form.html`: 

* `todos/templates/todos/todo_confirm_delete.html`:

* `todos/templates/registration/login.html:`

### 6. Update Settings
Add to `config/settings.py`:

`LOGIN_REDIRECT_URL = '/todos/'`
`LOGOUT_REDIRECT_URL = '/accounts/login/'`
`LOGIN_URL = '/accounts/login/'`

## Question 6. Tests
Now let's ask AI to cover our functionality with tests.

* Ask it which scenarios we should cover
* Make sure they make sense
* Let it implement it and run them
Probably it will require a few iterations to make sure that tests pass and evertyhing is working.

What's the command you use for running tests in the terminal?

* pytest
* python manage.py test
* python -m django run_tests
* django-admin test

## Running the app

Now the application is developed and tested. Run it:

```bash
python manage.py runserver
```

Since we asked AI to test everything, it should just work. If it doesn't, iterate with AI until it works.