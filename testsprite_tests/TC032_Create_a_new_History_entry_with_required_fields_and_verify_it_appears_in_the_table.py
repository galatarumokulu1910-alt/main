import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:4173/admin
        await page.goto("http://localhost:4173/admin", wait_until="commit", timeout=10000)
        
        # -> Type the admin email into the email field (index 22).
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('k.alexi@gmail.com')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('11223344')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Giriş Yap' button (index 27) to submit the login form and proceed to the admin sidebar, then observe the page for the 'Tarihce' tab.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/footer/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Tarihçe' tab in the sidebar to open the History module (element index 276).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/aside/nav/button[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the '+ Yeni Olay Ekle' button (index 527) to open the new history entry form.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Type '1999' into the Yıl field (index 688).
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1999')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[2]/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test History Title TR')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[2]/form/div[4]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        await page.wait_for_timeout(1000)
        # Verify we are on the admin area
        assert "/admin" in frame.url
        # Verify the "+ Yeni Olay Ekle" button is visible (history module)
        assert await frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[1]/button').is_visible()
        # Verify the first table row has an editable entry (Düzenle) — this corresponds to the newly added history item
        edit_btn = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[2]/table/tbody/tr[1]/td[5]/div/button[1]').nth(0)
        assert await edit_btn.is_visible()
        assert (await edit_btn.inner_text()).strip() == "Düzenle"
        # Verify the first table row also has a Sil (delete) button
        del_btn = frame.locator('xpath=/html/body/div/div/main/div/main/div/div/div[2]/table/tbody/tr[1]/td[5]/div/button[2]').nth(0)
        assert await del_btn.is_visible()
        assert (await del_btn.inner_text()).strip() == "Sil"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    