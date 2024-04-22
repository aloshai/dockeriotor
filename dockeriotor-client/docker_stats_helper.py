def calculate_cpu_percent_unix(v):
    previous_cpu = 0
    previous_system = 0
    
    if v["precpu_stats"] is not None:
        previous_cpu = v["precpu_stats"]["cpu_usage"]["total_usage"]
        previous_system = v["precpu_stats"]["system_cpu_usage"]
    
    cpu_percent = 0.0
    cpu_delta = float(v["cpu_stats"]["cpu_usage"]["total_usage"]) - float(previous_cpu)
    system_delta = float(v["cpu_stats"]["system_cpu_usage"]) - float(previous_system)
    
    online_cpus = len(v["cpu_stats"]["cpu_usage"]["percpu_usage"])
    
    cpu_percent = (cpu_delta / system_delta) * online_cpus * 100.0

    return cpu_percent
