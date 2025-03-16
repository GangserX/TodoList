from django.shortcuts import render

# Create your views here.
def task_list(request):
    context = {}
    return render(request, 'todo/task_list.html', context)