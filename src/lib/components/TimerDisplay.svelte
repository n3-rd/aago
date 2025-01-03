<script lang="ts">
    let { minutes, seconds, initialDuration } = $props<{ 
        minutes: number; 
        seconds: number;
        initialDuration: number;
    }>();
    
    let totalSeconds = $derived(minutes * 60 + seconds);
    let dashOffset = $derived(calculateDashOffset(totalSeconds));
    
    function calculateDashOffset(currentSeconds: number) {
        const circumference = 2 * Math.PI * 90; // r=90, circumference=2πr
        return ((initialDuration - currentSeconds) / initialDuration) * circumference;
    }
</script>

<div class="relative h-[200px] w-[200px] text-center">
    <div class="flex justify-center items-center h-full text-4xl font-light tracking-widest text-gray-700 relative z-10">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
    <svg class="absolute top-0 right-0 h-[200px] w-[200px] -scale-x-100 -rotate-90">
        <circle 
            r="90" 
            cx="100" 
            cy="100" 
            style:stroke-dasharray="565.48px"
            style:stroke-dashoffset="{dashOffset}px"
            class="stroke-black fill-none stroke-[2px] stroke-round transition-all duration-700 ease-in-out"
        />
        <circle 
            r="90" 
            cx="100" 
            cy="100" 
            style:stroke-dasharray="565.48px"
            style:stroke-dashoffset="{dashOffset}px"
            class="stroke-gray-500/30 fill-none stroke-[2px] stroke-round transition-all duration-700 ease-in-out"
        />
    </svg>
</div>

<style>
    /* We still need this for the stroke-round property since Tailwind doesn't have an equivalent */
    .stroke-round {
        stroke-linecap: round;
    }
</style> 